
## Python

- [What is a parameter?](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html#what-is-a-parameter)

## Cost

- [AWS Systems Manager pricing](https://aws.amazon.com/systems-manager/pricing/)

## Allow Lambda to Access Parameter

Quick approach

Assign `AmazonSSMFullAccess` to a role behind Lambda function. This provides full access to Amazon SSM (System Manager).

## Reference

- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [AWS Systems Manager (SSM) Parameters Store and Access using Lambda Function (Node/Javascript)](https://shivamethical.medium.com/aws-systems-manager-ssm-parameters-store-and-access-using-lambda-node-javascript-b1b21c83102b)