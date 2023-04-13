import * as rimraf from 'rimraf';
import * as chalk from 'chalk';
console.log(chalk.yellow.bold('Deleting previous local results...'));
// rimraf is the node-js OS agnostic implementation of rm -rf.
rimraf("./_results_/", function () { console.log(chalk.bold.green("./_results_/ deleted.")); });