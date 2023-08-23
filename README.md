# github-action-ecs-scale

The purpose of this repository is to provide a GitHub Action to
scale an ECS service's desired count up/down to a desired value.

## What it does

1. Uses the AWS SDK for JavaScript to update the specified ECS Service's `desired count` attribute to a given value.

### General Usage

```yaml
ecs-scaledown:
  name: Scale down ECS Service to zero
  runs-on: ubuntu-latest
  steps:
    - name: ecs-scaledown
      uses: zachelrath/github-action-ecs-scale
      with:
        service: your-service
        cluster: your-cluster
        desired-count: 0
```
