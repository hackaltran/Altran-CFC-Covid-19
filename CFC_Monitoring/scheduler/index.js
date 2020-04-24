const cloudant = require('../routes/service');
const Service = require('./service');

const CronJob = require('cron').CronJob;

const CRON_FORMAT = '*/5 * * * *'; // This will run after every 5 minutes.

const job = new CronJob(CRON_FORMAT, () => {
    console.log('\nJOB Started at: ', new Date());
    cloudant.getAllPatients((err, patients) => {
        if (err) {
            console.error('Error while getting all patients list: ', err);
            return;
        }
        Service.updatePatientScore(cloudant, patients.rows);
    });
}, null, true);
job.start();

console.log('Job scheduled...');
