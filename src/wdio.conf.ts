require('dotenv').config();
import allureReporter from '@wdio/allure-reporter';
import shelljs from 'shelljs';
import axios from 'axios';
import chalk from 'chalk';
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
let sessionID;
let baseWorkerUrl;

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    services: process.env.RUN_TESTS_LOCALLY == 'local' ? ['chromedriver'] : [],
    hostname: `${process.env.GGR_GRID_USERNAME}:${process.env.GGR_GRID_PASSWORD}@${process.env.SELENOID_BASE_IP}`,
    port: 4445,
    path: '/wd/hub/',
    protocol: 'http',
    //
    // =====================
    // ts-node Configurations
    // =====================
    //
    // You can write tests using TypeScript to get autocompletion and type safety.
    // You will need typescript and ts-node installed as devDependencies.
    // WebdriverIO will automatically detect if these dependencies are installed
    // and will compile your config and tests for you.
    // If you need to configure how ts-node runs please use the
    // environment variables for ts-node or use wdio config's autoCompileOpts section.
    //
    autoCompileOpts: {
        autoCompile: true,
        // see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
        // for all available options
        tsNodeOpts: {
            transpileOnly: true,
            project: 'tsconfig.json'
        }
        // tsconfig-paths is only used if "tsConfigPathsOpts" are provided, if you
        // do please make sure "tsconfig-paths" is installed as dependency
        //tsConfigPathsOpts: {
        //    baseUrl: './'
        //}
    },
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //

    // Number of retries for failed tests
    specFileRetries: parseInt(process.env.RETRY_FAILED_TESTS_COUNT) || 0,

    specs: [
        '../src/front-end/tests/**/**/**'
    ],
    suites: {
        demo: [
            '../src/front-end/tests/**/**',
        ],
    },
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: parseInt(process.env.PARRALEL_TEST_EXECUTION_WORKERS),
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    capabilities: [{

        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: parseInt(process.env.PARRALEL_TEST_EXECUTION_WORKERS),
        //
        browserName: 'chrome',
        acceptInsecureCerts: true,
        "goog:chromeOptions": {
            // example args for running in headless mode.
            // args: ["--excludeSwitches=enable-logging", "--headless", "--window-size=1920,1080", "--start-maximized"]
            args: ["--excludeSwitches=enable-logging"]
        },
        'selenoid:options': {
            enableVNC: true,
            enableVideo: true
        },
        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'silent',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: process.env.BASE_URL,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 240000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'jasmine',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    //
    // specFileRetriesDeferred: false,
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [
        ['spec', {
            symbols: {
                passed: '[PASS]',
                failed: '[FAIL]',
            },
            realtimeReporting: true,
        }],
        ['allure', {
            outputDir: './_results_/allure-raw',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }],
    ],



    //
    // Options to be passed to Jasmine.
    jasmineOpts: {
        // Jasmine default timeout
        defaultTimeoutInterval: 480000,
        stopOnSpecFailure: true,
        //
        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
        expectationResultHandler: function (passed, assertion) {
            // do something
        },
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: async function (config, capabilities) {
        if (process.env.DELETE_PREVIOUS_ALLURE_RESULTS_BEFORE_RUN === 'true') {
            shelljs.exec('npm run allure:cleanRemote');
        }
        if (process.env.DELETE_PREVIOUS_LOCAL_RESULTS_BEFORE_RUN === 'true') {
            shelljs.exec('npm run allure:cleanLocal');
        }

        if (process.env.SSH_ENABLE_GRAB_LOGS_FROM_SERVER === 'true' || process.env.SSH_ENABLE_GRAB_LOGS_FROM_MYSQL === 'true') {
            try {
                console.log(chalk.yellow.bold('Attempting to establish SSH connection and to empty logs...'));
                await ssh.connect({
                    host: process.env.SSH_HOSTNAME_FOR_DEVELOPER_LOGS,
                    username: process.env.SSH_USER_NAME_FOR_DEVELOPER_LOG,
                    password: process.env.SSH_PASSWORD_FOR_DEVELOPER_LOG,
                    reconnect: false,
                });
                console.log(chalk.bold.green('SSH Connection Established!'));
            } catch (err) {
                console.log(chalk.bold.red(`An error occurred during ssh: ${err}`));
                await ssh.dispose();
            }
        }

        if (process.env.SSH_ENABLE_GRAB_LOGS_FROM_SERVER === 'true') {
            await console.log(chalk.green.bold('Emptying server logs...'));
            await ssh.execCommand(`truncate -s 0 ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/debug.log`).then(function (result) {
                return result.stdout;
            });
        }
    },

    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    onWorkerStart: function (cid, caps, specs, args, execArgv) {
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {String} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {Object}         browser      instance of created browser/device session
    //  */
    before: async function (capabilities, specs) {
        sessionID = await browser.sessionId; // this is GGR session id if GGR is used, to convert to real session id remove first 32 chars
        if (process.env.GGR_GRID_MODE === 'true') {
            try {
                const response = await axios.get(`http://${process.env.GGR_GRID_USERNAME}:${process.env.GGR_GRID_PASSWORD}@34.159.45.23:4445/host/${sessionID}`, {
                    maxRedirects: 0,
                    validateStatus: status => status >= 200 && status < 300 || status === 304,
                });
                this.workerServerName = response.data.Name;
            } catch (error) {
                console.error(error);
            };

            if (this.workerServerName === undefined) {
                throw new Error(chalk.bold.red('Cannot get worker server name from GGR'));
            };

            if (this.workerServerName === '0.0.0.0') {
                baseWorkerUrl = 'http://0.0.0.0'
            };

            if (this.workerServerName === '0.0.0.0') {
                baseWorkerUrl = 'http://0.0.0.0'
            };

            if (this.workerServerName === '0.0.0.0') {
                baseWorkerUrl = 'http://0.0.0.0'
            };
            await console.log(`[GRID SERVER]->[${chalk.bold.green(baseWorkerUrl)}] live stream link from test : ` + chalk.bold.cyan(`${baseWorkerUrl}:8080/#/sessions/${sessionID.slice(32)}`));
            await console.log(`[GRID SERVER]->[${chalk.bold.green(baseWorkerUrl)}] video will be available after test completes/fails at : ` + chalk.bold.cyan(`${baseWorkerUrl}:8080/video/${sessionID.slice(32)}.mp4`));
        } else {
            await console.log(`[${process.env.SELENOID_BASE_IP}] live stream link from test : ` + chalk.bold.cyan(`http://${process.env.SELENOID_BASE_IP}:8080/#/sessions/${sessionID}`));
            await console.log(`[${process.env.SELENOID_BASE_IP}] video will be available after test completes/fails at : ` + chalk.bold.cyan(`http://${process.env.SELENOID_BASE_IP}:8080/video/${sessionID}.mp4`));
        };

    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {

    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    beforeSuite: async function (suite) {
        await browser.maximizeWindow();
    },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {

    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    beforeHook: async function (test, context) {
        if (process.env.GGR_GRID_MODE === 'true') {
            await allureReporter.addAttachment('Selenoid session video', Buffer.from("<html lang='en'><body><video width='100%' height='100%' controls autoplay><source src='"
                + baseWorkerUrl + ':8080/video/' + sessionID.slice(32) + ".mp4"

                + "' type='video/mp4'></video></body></html>", 'utf-8'), 'text/html');

            await allureReporter.addAttachment(
                `Selenoid Worker :  ${baseWorkerUrl}`,
                Buffer.from(`<html lang='en'><body><h1><a href="${baseWorkerUrl}:8080" target="_blank"> Selenoid Worker : ${baseWorkerUrl}:8080 </a></h1></body></html>`, 'utf-8'), 'text/html'
            );

        } else {
            await allureReporter.addAttachment('Selenoid session video', Buffer.from("<html lang='en'><body><video width='100%' height='100%' controls autoplay><source src='"
                + process.env.SELENOID_VIDEO_BASE_URL + sessionID + ".mp4"
                + "' type='video/mp4'></video></body></html>", 'utf-8'), 'text/html');
        }
        await browser.pause(5000);
    },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }) {

    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {Object}  test             test object
     * @param {Object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {Any}     result.result    return object of test function
     * @param {Number}  result.duration  duration of test
     * @param {Boolean} result.passed    true if test has passed, otherwise false
     * @param {Object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            if (process.env.SSH_ENABLE_GRAB_LOGS_FROM_SERVER === 'true' || process.env.SSH_ENABLE_GRAB_LOGS_FROM_MYSQL === 'true') {
                try {
                    console.log(chalk.bold.red('Test failed -> Attempting to establish SSH connection ...'));
                    await ssh.connect({
                        host: process.env.SSH_HOSTNAME_FOR_DEVELOPER_LOGS,
                        username: process.env.SSH_USER_NAME_FOR_DEVELOPER_LOG,
                        password: process.env.SSH_PASSWORD_FOR_DEVELOPER_LOG,
                        reconnect: false,
                    });
                    console.log(chalk.bold.green('SSH Connection Established!'));
                } catch (err) {
                    console.log(chalk.bold.red(`An error occurred during ssh: ${err}`));
                    await ssh.dispose();
                }
            }
            let serverLogOutput;
            if (process.env.SSH_ENABLE_GRAB_LOGS_FROM_SERVER === 'true') {
                serverLogOutput = await ssh.execCommand(`tail -n 8000 ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/debug.log`).then(function (result) {
                    return result.stdout;
                });

                await console.log('Grabbing server logs...');
                await allureReporter.addAttachment('Server Log', `<html lang='en'><body><pre>${Buffer.from(serverLogOutput)}</pre></body></html>`, 'text/html');
            }

            if (process.env.SSH_ENABLE_GRAB_LOGS_FROM_MYSQL === 'true' && await serverLogOutput.includes('Deadlock')) {
                await console.log('Deadlock found... Grabbing MySQL/InnoDB logs...');
                await ssh.exec(`echo "SHOW ENGINE INNODB STATUS \\G;"| mysql -u${process.env.SSH_MYSQL_USER_NAME_FOR_INNODB_LOG} -p${process.env.SSH_MYSQL_PASSWORD_FOR_INNODB_LOG} > ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/runtime/logs/innodb.log`);
                const innodbOutput = await ssh.execCommand(`tail -n 8000 ${process.env.SSH_ABOSULTE_PATH_TO_DASHBOARD_ROOT_DIRECTORY}/innodb.log`).then(function (result) {
                    return result.stdout;
                });
                await allureReporter.addAttachment('MySQL/InnoDB Log', `<html lang='en'><body><pre>${Buffer.from(innodbOutput)}</pre></body></html>`, 'text/html');
            }
        }
    },

    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: async function (exitCode, config, capabilities, results) {
        if (process.env.PUSH_TEST_RESULTS_TO_ALLURE === 'true') {
            shelljs.exec('npm run allure:upload');
        }
    },
    /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
    //onReload: function(oldSessionId, newSessionId) {
    //}
}
