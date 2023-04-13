import fetch from 'node-fetch';
require('dotenv').config({ path: '.env' });
import { authenticateInAllure } from './authenticate.allure';
let cleanResultsStatusCode: number;
let cleanHistoryStatusCode: number;
let retryTimes = 1;

async function cleanResults() {
    const { cookieContent } = await authenticateInAllure();
    const headers = {
        'Content-type': 'application/json',
        cookie: cookieContent,
    }
    await fetch(process.env.ALLURE_SERVER_BASE_URL + '/allure-docker-service/clean-results?project_id=' + process.env.ALLURE_PROJECT_ID, {
        method: 'GET',
        headers: headers
    }).then(response => {
        console.log('Response from allure server for clean results: ' + response.status + ' ' + response.statusText);
        cleanResultsStatusCode = response.status;
    }).catch(err => console.error(err));
    await fetch(process.env.ALLURE_SERVER_BASE_URL + '/allure-docker-service/clean-history?project_id=' + process.env.ALLURE_PROJECT_ID, {
        method: 'GET',
        headers: headers
    }).then(response => {
        console.log('Response from allure server for clean history: ' + response.status + ' ' + response.statusText);
        cleanHistoryStatusCode = response.status;
    }).catch(err => console.error(err));
    if (retryTimes > 5) {
        throw new Error('Unable to clean allure results & history.');
    }
    if (cleanResultsStatusCode !== 200 || cleanHistoryStatusCode !== 200) {
        console.log(`Retrying ${retryTimes} out of 5 ....`);
        retryTimes++;
        cleanResults();
    }
};
cleanResults();