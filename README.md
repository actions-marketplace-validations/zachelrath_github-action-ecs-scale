# github-action-ecs-scale

The purpose of this repository is to provide a GitHub Action to
scale an ECS service's desired count up/down to a desired value.

## What it does

1. Uses the AWS SDK for JavaScript to update the specified ECS Service's `desired count` attribute to a given value.

### General Usage

This Action expects that you have already configured AWS credentials in a prior step, e.g. using [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials). Please see that Action's documentation for more details.

```yaml
jobs:
  ecs-scaledown:
    name: Scale down ECS Tasks
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: ${{ secrets.AWS_ECS_ROLE_ARN }}
          role-session-name: ecsscale
          aws-region: ${{ vars.AWS_REGION }}
      - name: Scale Web App to zero
        uses: zachelrath/github-action-ecs-scale@1.2.0
        with:
          service: ${{ vars.ECS_WEB_APP_SERVICE_NAME }}
          cluster: ${{ vars.ECS_CLUSTER_NAME }}
          desired-count: 0
      - name: Scale Worker task to 1
        uses: zachelrath/github-action-ecs-scale@1.2.0
        with:
          service: ${{ vars.ECS_WORKER_SERVICE_NAME }}
          cluster: ${{ vars.ECS_CLUSTER_NAME }}
          desired-count: 1
```
