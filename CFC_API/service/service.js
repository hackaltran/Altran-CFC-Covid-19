const WeightService = require('./weightage-calculation.service');

var SERVICE = {

    updatePatientScore: async (cloudant, patient) => {
        if (patient && (patient.symptom.length === 0)) {
            console.log('No symptom found! Therefore not calulating weightage.')
            return null;
        }
            try {
                const updatedFields = await SERVICE.getScore(patient);

                // When no fields to update, then return
                if (updatedFields === null) {
                    return null;
                }

              //  await cloudant.updateCovidStatus(patient.id, updatedFields);
              
                console.log('Updated record for PatientId-"%s" successfully! \n', patient._id);
                return updatedFields;
            } catch (err) {
                console.error('ERROR: Something went wrong during updating Patient with id-"%s"', patient.id, err);
                console.log('\n');
                return null;
            }

    },

    getScore: function (patient) {
        const data = patient;

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
       // console.log(updatedFields.healthstatus);
        if (updatedFields.healthstatus != 'none') {
            updatedFields.qurantine = { isQurantine: true, started: Date.now(), end: Date.now() + 1.21e+9 }
        }
        // else {
        //     updatedFields.qurantine = { isQurantine: false, started: 0, end: 0 }
        // }

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