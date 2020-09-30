const builder = require('@dxdeveloperexperience/codelab-generator');
const watch = require('node-watch');
const ora = require('ora');
const ncpCallback = require('ncp').ncp;
const util = require('util');

const cp = util.promisify(ncpCallback);

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const buildApp = async () => {
  const buildOra = ora('Building codelab').start();
  await builder('./src/codelab.md', 'tmpLab');
  // Dirty hack, waiting for a way to await the end of the generation
  // see https://github.com/DX-DeveloperExperience/codelab-generator/pull/16
  await sleep(1000)
  buildOra.succeed('Codelab generated');
  const copyOra = ora('Copy images').start();
  await cp('./src/img/', 'tmpLab/img/');
  copyOra.succeed('Images copied');
}

watch('./src/codelab.md', buildApp);
watch('./src/img', buildApp);

buildApp();