require('dotenv').config();
const { NodeSSH } = require('node-ssh');

const ssh = new NodeSSH();

async function testSSHGrabbing() {
    try {
        await console.log(`Following configs loaded:`);
        await console.log(`SSH_ENABLE_GRAB_LOGS_FROM_SERVER: ${process.env.SSH_ENABLE_GRAB_LOGS_FROM_SERVER}`);
        await console.log(`SSH_HOSTNAME_FOR_DEVELOPER_LOGS: ${process.env.SSH_HOSTNAME_FOR_DEVELOPER_LOGS}`);
        await console.log(`SSH_USER_NAME_FOR_DEVELOPER_LOG: ${process.env.SSH_USER_NAME_FOR_DEVELOPER_LOG}`);
        await console.log(`SSH_PASSWORD_FOR_DEVELOPER_LOG: ${process.env.SSH_PASSWORD_FOR_DEVELOPER_LOG}`);
        await console.log(`Target file: ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/debug.log`);
        await console.log('Attempting to connect...');

        await ssh.connect({
            host: process.env.SSH_HOSTNAME_FOR_DEVELOPER_LOGS,
            username: process.env.SSH_USER_NAME_FOR_DEVELOPER_LOG,
            password: process.env.SSH_PASSWORD_FOR_DEVELOPER_LOG,
        });

        console.log("Connection established");

        let serverLogOutput;
        await console.log(`Attempting to grab server log...`);
        serverLogOutput = await ssh.execCommand(`tail -10 ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/debug.log`).then(function (result) {
            return result.stdout;
        });
        await console.log('Trying to grab the 10 lines of the log file...');
        await console.log(`server log :
    ${serverLogOutput}`);
        if (serverLogOutput.length > 0) {
            console.log('Server log grabbed successfully.');
            await ssh.dispose();
        }
    } catch (err) {
        console.log(`An error occurred: ${err}`);
        ssh.dispose();
    }
}
testSSHGrabbing();