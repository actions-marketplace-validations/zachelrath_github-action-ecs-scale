const core = require('@actions/core');
const aws = require('aws-sdk');

async function run() {
  const service = core.getInput('service');
  const cluster = core.getInput('cluster');
  const desiredCount = core.getInput('desired-count');
  try {
    if (!service) {
      core.setFailed('You must specify a service')
      return
    }
    if (!cluster) {
      core.setFailed('You must specify a cluster')
      return
    }
    if (desiredCount === '' || isNaN(desiredCount)) {
      core.setFailed('You must specify a desired number of tasks')
      return
    }
    const desiredCountAsNumber = parseInt(desiredCount, 10);
    if (desiredCountAsNumber < 0) {
      core.setFailed('Desired count must be a positive integer')
      return
    }
    // Connect to ecs and pull the task definition
    const ecs = new aws.ECS({
      customUserAgent: 'amazon-ecs-deploy-task-definition-for-github-actions'
    });
    await ecs.updateService({ service, cluster, desiredCount: desiredCountAsNumber, }).promise();
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = run;