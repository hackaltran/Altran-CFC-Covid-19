module.exports = {
    getAgeWeightage: function (data) {
        let ageWeightage = 0;

        ageWeightage = data.age <= 1 ? 1.5
                        : data.age > 1  && data.age <= 5  ? 1.25
                        : data.age > 5  && data.age <= 19 ? 1.1
                        : data.age > 19 && data.age <= 40 ? 1
                        : data.age > 40 && data.age <= 50 ? 1.25
                        : data.age > 50 && data.age <= 60 ? 1.5
                        : data.age > 60 && data.age <= 70 ? 2
                        : data.age > 70 && data.age <= 80 ? 3
                        : 4;    // For Age > 80

        ageWeightage = ageWeightage * 5;
        return ageWeightage;
    },

    genderWeightage: function (data) {
        let genderWeightage = 0;

        let value = data.gender ? data.gender.trim().toLowerCase() : '';
        switch (value) {
            case 'male':
                genderWeightage = 1.5;
                break;
            case 'female':
                genderWeightage = 1.25;
                break;
            case 'others':
                genderWeightage = 1.5;
                break;
            default:
                genderWeightage = 0;
                break;
        }

        genderWeightage = genderWeightage * 3;
        return genderWeightage;
    },

    morbidityWeightage: function (data) {
        let morbidityWeightage = 0;

        let value = data.morbidity ? data.morbidity.trim().toLowerCase() : '';
        switch (value) {
            case 'hyper tension':
                    morbidityWeightage = 2;
                break;

            case 'cardiac condition':
                morbidityWeightage = 2;
                break;

            case 'diabatese':
                morbidityWeightage = 4;
                break;

            case 'cancer':
                morbidityWeightage = 3;
                break;

            case 'immunity':
                morbidityWeightage = 3;
                break;

            case 'none':
                morbidityWeightage = 0;
                break;

            default:
                morbidityWeightage = 0;
                break;
        }

        morbidityWeightage = morbidityWeightage * 6;
        return morbidityWeightage;
    },

    symptomWeightage: function (symptom) {
        // If no symptom, then return weightage as zero;
        if (symptom === null) {
            return 0;
        }

        let symptomWeightage = 0;
        let value = symptom.experience ? symptom.experience.trim().toLowerCase() : '';
        switch (value) {
            case 'running nose':
                symptomWeightage = 1.5;
                break;
            case 'soar throat':
                symptomWeightage = 1.25;
                break;
            case 'diarrhoea':
                symptomWeightage = 1.1;
                break;
            case 'headache':
                symptomWeightage = 1;
                break;
            case 'bodyache':
                symptomWeightage = 1.25;
                break;
            case 'restlessness':
                symptomWeightage = 2;
                break;
            case 'fatigue':
                symptomWeightage = 3;
                break;
            case 'sleepiness':
                symptomWeightage = 3;
                break;
            case 'confusion':
                symptomWeightage = 4;
                break;
            case 'laboured breathing':
                symptomWeightage = 5;
                break;
            case 'cough with sputum':
                symptomWeightage = 3;
                break;
            case 'dry cough':
                symptomWeightage = 7;
                break;
            case 'none':
            case 'none of these':
                symptomWeightage = 0;
                break;
            default:
                symptomWeightage = 0;
                break;
        }

        symptomWeightage = symptomWeightage * 7;
        return symptomWeightage;
    },

    temperatureWeightage: function (symptom) {
        // If no symptom, then return weightage as zero;
        if (symptom === null) {
            return 0;
        }


        //////////////////////////////////////////////////////////
        // FIX: Temperature value in Number/String both take care.
        //////////////////////////////////////////////////////////
        var lastTemperature;
        if (symptom && symptom.temperature) {
            if (!isNaN(Number(symptom.temperature))) {
                let temp = Number(symptom.temperature);
                lastTemperature = temp;
                symptom.temperature = temp <= 98.6                  ? 'normal'
                                    : temp > 98.6 && temp <= 99.5   ? 'medium'
                                    : temp > 99.5 && temp <= 102    ? 'high' 
                                    : 'very high';
            }
        }
        //////////////////////////////////////////////////////////

        let temperatureWeightage = 0;
        let value = symptom.temperature ? symptom.temperature.trim().toLowerCase() : '';
        if(lastTemperature){
            symptom.temperature = lastTemperature.toString();
        }
        switch (value) {
            case 'normal':
                temperatureWeightage = 1;
                break;
            case 'medium':
                temperatureWeightage = 1.25;
                break;
            case 'high':
                temperatureWeightage = 1.5;
                break;
            case 'very high':
                temperatureWeightage = 2;
                break;
            default:
                temperatureWeightage = 0;
                break;
        }

        temperatureWeightage = temperatureWeightage * 2;
        return temperatureWeightage;
    },

    pulseWeightage: function (symptom) {
        // If no symptom, then return weightage as zero;
        if (symptom === null) {
            return 0;
        }

        //////////////////////////////////////////////////////////
        // FIX: Heart rate value in Number/String both take care.
        //////////////////////////////////////////////////////////
        var lastHeartRate;
        if (symptom && symptom.heart_rate) {
            if (!isNaN(Number(symptom.heart_rate))) {
                let temp = Number(symptom.heart_rate);
                lastHeartRate = temp;
                symptom.heart_rate = temp <= 90                   ? 'normal'
                                    : temp > 90 && temp <= 120    ? 'medium'
                                    : temp > 120 && temp <= 150   ? 'high' 
                                    : 'very high';
            }
        }
        //////////////////////////////////////////////////////////

        let pulseWeightage = 0;
        let value = symptom.heart_rate ? symptom.heart_rate.trim().toLowerCase() : '';
        if(lastHeartRate){
            symptom.heart_rate = lastHeartRate.toString();
        }
        switch (value) {
            case 'normal':
                pulseWeightage = 1;
                break;
            case 'medium':
                pulseWeightage = 1.25;
                break;
            case 'high':
                pulseWeightage = 1.5;
                break;
            case 'very high':
                pulseWeightage = 2;
                break;
            default:
                pulseWeightage = 0;
                break;
        }

        pulseWeightage = pulseWeightage * 1;
        return pulseWeightage;
    },

    breathingWeightage: function (symptom) {
        // If no symptom, then return weightage as zero;
        if (symptom === null) {
            return 0;
        }

        let breathingWeightage = 0;
        let value = symptom.breathing_rate ? symptom.breathing_rate.trim().toLowerCase() : '';
        switch (value) {
            case 'normal':
                breathingWeightage = 1;
                break;
            case 'high':
                breathingWeightage = 1.25;
                break;
            case 'very high':
                breathingWeightage = 1.5;
                break;
            default:
                breathingWeightage = 0;
                break;
        }

        breathingWeightage = breathingWeightage * 4;
        return breathingWeightage;
    },

    bloodWeightage: function (symptom) {
        // If no symptom, then return weightage as zero;
        if (symptom === null) {
            return 0;
        }

        let bloodWeightage = 0;
        let value = symptom.blood ? symptom.blood.trim().toLowerCase() : '';
        switch (value) {
            case 'normal':
                bloodWeightage = 1;
                break;
            case 'high':
                bloodWeightage = 1.25;
                break;
            case 'very high':
                bloodWeightage = 1.5;
                break;
            case 'low':
                bloodWeightage = 1;
                break;
            case 'very low':
                bloodWeightage = 1.5;
                break;
            default:
                bloodWeightage = 0;
                break;
        }

        bloodWeightage = bloodWeightage * 1;
        return bloodWeightage;
    }

};
