const core = require('@actions/core');
const run = require('./updateServiceCount.js');

jest.mock('@actions/core');

const FAKE_SERVICE = 'fake-service'
const FAKE_CLUSTER = 'fake-cluster'

function mockGetInput(requestResponse) {
  return function (name, options) { // eslint-disable-line no-unused-vars
      return requestResponse[name]
  }
}

const NO_INPUTS = {}
const SERVICE_ONLY = {
  service: FAKE_SERVICE,
}
const CLUSTER_ONLY = {
  cluster: FAKE_CLUSTER,
}

const NO_DESIRED_COUNT = {
  service: FAKE_SERVICE,
  cluster: FAKE_CLUSTER,
}
const INVALID_DESIRED_COUNT = {
  service: FAKE_SERVICE,
  cluster: FAKE_CLUSTER,
  "desired-count": 'not a number',
}
const NEGATIVE_DESIRED_COUNT = {
  service: FAKE_SERVICE,
  cluster: FAKE_CLUSTER,
  "desired-count": '-1',
}

const ALL_INPUTS = {
  service: FAKE_SERVICE,
  cluster: FAKE_CLUSTER,
  "desired-count": '1',
}

const mockUpdateService = jest.fn()

jest.mock('aws-sdk', () => {
  return {
    ECS: jest.fn(() => ({
      updateService: mockUpdateService
    }))
  }
})

describe('Update Service Count', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUpdateService.mockReset();
    mockUpdateService
      .mockReturnValueOnce({
        promise() {
          return Promise.resolve({ service: {
            desiredCount: 1
          }})
        }
      })
  })

  test('action fails when service and cluster are not set', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(NO_INPUTS))
    await run();

    expect(core.setFailed)
  })

  test('action fails when cluster is not set', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(SERVICE_ONLY))
    await run();

    expect(core.setFailed)
  })

  test('action fails when service is not set', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(CLUSTER_ONLY))
    await run();

    expect(core.setFailed)
  })

  test('action fails when desired count is not set', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(NO_DESIRED_COUNT))
    await run();

    expect(core.setFailed)
  })
  test('action fails when desired count is not a number', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(INVALID_DESIRED_COUNT))
    await run();

    expect(core.setFailed)
  })

  test('action fails when desired count is less than zero', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(NEGATIVE_DESIRED_COUNT))
    await run();

    expect(core.setFailed)
  })


  test('when a valid cluster, service, and desired count are provided, function runs successfully', async () => {
    core.getInput = jest
      .fn()
      .mockImplementation(mockGetInput(ALL_INPUTS))
    await run();
    expect(mockUpdateService).toHaveBeenCalledTimes(1)
    expect(mockUpdateService).toHaveBeenNthCalledWith(1, {'service': FAKE_SERVICE, 'cluster': FAKE_CLUSTER, 'desiredCount': 1})
  })
});