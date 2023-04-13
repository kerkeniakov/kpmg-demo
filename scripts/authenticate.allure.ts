import fetch from 'node-fetch';
require('dotenv').config({ path: '.env' });
const headers = { 'Content-type': 'application/json' };
import * as chalk from 'chalk';

export async function authenticateInAllure() {
    const response = await fetch(process.env.ALLURE_SERVER_BASE_URL + 'allure-docker-service/login', {
        method: 'POST',
        headers: headers,
        // @ts-ignore
        credentials: 'include',
        body: JSON.stringify({
            username: process.env.ALLURE_API_USERNAME,
            password: process.env.ALLURE_API_PASSWORD
        }),
    });
    if (!response.ok) {
        const message = `An error has occured while authenticating in allure status code returned: ${await response.status} + ${await response.text()}`;
        throw new Error(message);
    }
    await console.log(chalk.green.bold('Authenticating in Allure API successful'));
    let cookieContent: any = await response.headers.get('set-cookie') || '';
    let csrf_access_token = cookieContent.toString().match(/csrf_access_token=(.*?);/)[1];
    return { cookieContent, csrf_access_token };
}
