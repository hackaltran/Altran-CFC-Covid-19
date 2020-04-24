const WeightService = require('./weightage-calculation-service');

var SERVICE = {

    updatePatientScore: async (cloudant, patients) => {
        if (patients && (patients.length === 0)) {
            console.log('No patients found! Therefore not calulating weightage.')
            return;
        }

        // For Synchronously updating patient's score
        for (let index = 0; index < patients.length; index++) {
            const patient = patients[index];
            try {
                const updatedFields = await SERVICE.getScore(patient);

                // When no fields to update, then return
                if (updatedFields === null) {
                    continue;
                }

                await cloudant.updateCovidStatus(patient.id, updatedFields);
                console.log('Updated record for PatientId-"%s" successfully! \n', patient.id);
            } catch (err) {
                console.error('ERROR: Something went wrong during updating Patient with id-"%s"', patient.id, err);
                console.log('\n');
            }
        }

        // For Asynchronously updating patient's score
        // patients.map(patient => {
        //     SERVICE.getScore(patient)
        //         .then(updatedFields => {
        //             return cloudant.updateCovidStatus(patient.id, updatedFields);
        //         })
        //         .then(data => {
        //             console.log('Updated PatientId-', patient.id);
        //         })
        //         .catch(error => {
        //             console.log('Something went wrong during weightage calculation:', error);
        //         });
        // });
    },

    getScore: async function (patient) {
        const data = patient.doc;

        const latestSymptom = SERVICE.getLatestSymptomForMyself(data);
        if(latestSymptom === null) {
            console.log('No Symptom for PatientId-"%s". Therefore, not calculating it\'s score. \n', patient.id);
            return null;
        }

        let weightage = {};
        let updatedFields = {};

        // Calculating weightage based on data
        weightage.ageWeightage       = WeightService.getAgeWeightage(data);
        weightage.genderWeightage    = WeightService.genderWeightage(data);
        weightage.morbidityWeightage = WeightService.morbidityWeightage(data);

        // Calculating weightage based on latest symptom in data
        weightage.symptomWeightage     = WeightService.symptomWeightage(latestSymptom);
        weightage.temperatureWeightage = WeightService.temperatureWeightage(latestSymptom);
        weightage.pulseWeightage       = WeightService.pulseWeightage(latestSymptom);
        weightage.bloodWeightage       = WeightService.bloodWeightage(latestSymptom);
        weightage.breathingWeightage   = WeightService.breathingWeightage(latestSymptom);

        // Calculating total score
        const score = weightage.ageWeightage
                    + weightage.genderWeightage
                    + weightage.morbidityWeightage
                    + weightage.symptomWeightage
                    + weightage.temperatureWeightage
                    + weightage.pulseWeightage
                    + weightage.bloodWeightage
                    + weightage.breathingWeightage;

        // Calculating status based on score
        updatedFields.healthstatus = score < 25 ? 'none'
                                    : ((score >= 25 && score < 75) ? 'possible'
                                    : 'positive');

        updatedFields.currentCovidScore = score;

        // console.log(patient.id, JSON.stringify(weightage));
        return updatedFields;
    },

    getLatestSymptomForMyself: function (data) {
        if (data && data.symptom && (data.symptom.length > 0)) {
            let symptoms = data.symptom;
            let latestSymptom = symptoms.filter(symptom => (symptom.family && symptom.family.toLowerCase()) === 'myself')
            if(latestSymptom.length === 0) {
                return null;
            }
            latestSymptom = latestSymptom.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current); // Finding latest symptom based on timestamp

            return latestSymptom;
        } else {
            return null;
        }
    }

};

module.exports = SERVICE;