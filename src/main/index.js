const configAwsCreds = require('./configAwsCreds')
const updateServiceCount = require('./updateServiceCount')

async function run() {
  await configAwsCreds()
  await updateServiceCount()
}

module.exports = run;

if (require.main === module) {
    run();
}
