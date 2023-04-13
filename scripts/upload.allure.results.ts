import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import { authenticateInAllure } from './authenticate.allure';
require('dotenv').config({ path: '.env' });
const sleep = require('util').promisify(setTimeout);
import * as chalk from 'chalk';

console.log(chalk.yellowBright('Pushing results to Allure server...'));
const allure_results_directory = './_results_/allure-raw'
const allure_server = process.env.ALLURE_SERVER_BASE_URL
const allure_project_id = process.env.ALLURE_PROJECT_ID

// @ts-ignore
let pushResultsStatusCode;
let retryTimes = 0;

let results: object[] = [];
async function pushResults() {
    var items = await fs.readdir(allure_results_directory);
    for (const fileName of items) {
        let result: object = {};
        var content = await fs.readFile(`${allure_results_directory}/${fileName}`, 'base64');
        // @ts-ignore
        result['file_name'] = fileName;
        // @ts-ignore
        result['content_base64'] = await new Buffer.from(content, 'base64').toString('base64');
        const fileSize = (await fs.stat(`${allure_results_directory}/${fileName}`)).size
        // allure throws an error if we try to upload a file with no base64 content and 0kb filesize..
        if (fileSize > 0) {
            await results.push(result);
        }
    }

    if (results === undefined || results.length == 0) {
        throw new Error(chalk.bold.red('No results to push to allure server. Did you get an error when running the tests?'));
    }

    let request_body = {
        "results": results
    }

    let json_request_body = JSON.stringify(request_body);

    const { cookieContent, csrf_access_token } = await authenticateInAllure();
    const headers = {
        'Content-type': 'application/json',
        ['X-CSRF-TOKEN']: csrf_access_token,
        cookie: cookieContent
    }

    await fetch(allure_server + 'allure-docker-service/send-results?project_id=' + allure_project_id, {
        method: 'POST',
        headers: headers,
        body: `${json_request_body}`
    }).then(async response => {
        await console.log('Response from allure server: ' + response.status + ' ' + response.statusText);
        pushResultsStatusCode = response.status;
    }).catch(err => console.error(err));
    if (retryTimes > 5) {
        throw new Error('Unable to push allure results.');
    }
    // @ts-ignore
    if (pushResultsStatusCode !== 200) {
        console.log(`Received status code !== 200. Retrying ${retryTimes} out of 5 ....`);
        await sleep(2000);
        retryTimes++;
        await pushResults();
    }
    console.log(chalk.bold.green('Test results are available at : ' + process.env.ALLURE_SERVER_BASE_URL?.replace('5050', '5252') + 'allure-docker-service-ui/projects/' + process.env.ALLURE_PROJECT_ID + '/reports/latest'));
}
pushResults();