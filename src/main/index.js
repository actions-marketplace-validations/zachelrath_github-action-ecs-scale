
const updateServiceCount = require('./updateServiceCount')

async function run() {
  await updateServiceCount()
}

module.exports = run;

if (require.main === module) {
    run();
}
