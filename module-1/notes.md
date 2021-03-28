# Notes and useful commands

## SAM resource definition for functions

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html

## set AWS env variables

export AWS_REGION=eu-north-1
export AWS_DEFAULT_REGION=eu-north-1
export AWS_PROFILE=workshop

## Remove a stack from your account 

aws cloudformation delete-stack --stack-name sam-app 

## Describe a stack using CLI

aws cloudformation describe-stacks --stack-name poller-backend

## Query for outputs

aws cloudformation describe-stacks --stack-name poller-backend --query 'Stacks[].Outputs' 

aws cloudformation describe-stacks --stack-name poller-backend --query 'Stacks[].Outputs[?OutputKey==`APIURL`].OutputValue'  --output text

aws cloudformation describe-stacks --stack-name poller-backend --query 'Stacks[].Outputs[]' --output table


## Start the API locally

sam local start-api

sam local start-api -d 5858

## install eslint

npm i -g eslint

## validate JS code

eslint directory (eg eslint . for current dir)

## validate template

cfn-lint template.yaml

sam validate

## initialise Node project (for tests)

npm i

## run Node tests

npm t

## Turn JS object into string

JSON.stringify(event, null, 2)

## extract logs locally

sam logs -n PollManagementFunction --stack-name poller-backend

## Turn string into JS object

JSON.parse(text)

## Lambda context

https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html

## Prevent Node.js lambdas from stalling

context.callbackWaitsForEmptyEventLoop = false;

## Define a Dynamo table using cloudformation

  PollingTable:
    Type: AWS::DynamoDB::Table
    Properties:
      AttributeDefinitions:
        - AttributeName: "pollId"
          AttributeType: "S"
      KeySchema:
        - AttributeName: "pollId"
          KeyType: "HASH"
      BillingMode: "PAY_PER_REQUEST"
      SSESpecification:
        SSEEnabled: true

## CloudFormation resource for DynamoDB

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html

## CloudFormation functions

```
!Ref PollingTable
!GetAtt PollingTable.Arn
!Sub "something-${PollingTable}-something else"
!Sub "something-${PollingTable.Arn}-something else"
```

## Run only tests from a specific file

npm t -- part-of-filename

## Run only tests with a specific description

npm t -- -t "description"

## Dynamo document client

https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

## Wire Policies into a function

  PollManagementFunction:
    Type: AWS::Serverless::Function
    Properties:
      Policies:
        - Statement:
          - Effect: Allow
            Action:
              - dynamodb:GetItem
              - dynamodb:PutItem
            Resource: !GetAtt PollingTable.Arn

## Dynamo IAM policies

https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazondynamodb.html

## Link objects in the same template

  PollManagementFunction:
    Type: AWS::Serverless::Function
    Properties:
      Environment:
        Variables:
          POLLINGTABLE: !Ref PollingTable
   

## retrieve an environment variable in JS

const table = process.env.POLLINGTABLE;

## run/debug locally with variables

sam local start-api --env-vars tests/env.json


## Add logging to dynamo

verboseLogging = process.env.DEBUG;
logger = verboseLogging ? console: false;
dynamoDbClient = new aws.DynamoDB.DocumentClient({
  params: {TableName: dbName},
  logger
});


## define stack parameters

AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Parameters:
  VerboseLog:
    Type: String
    Default: ''
    Description: 'Set to something to provide detailed logging'

  
## set parameter when deploying

sam deploy --parameter-overrides VerboseLog=Yes

## query cloudwatch insights

fields action, pollId, @timestamp
| filter action = 'create'
| sort @timestamp desc
| limit 20

## Cloudwatch insights query language docs

https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html


## Add external library

cd poll-management
npm init --yes
npm install aws-embedded-metrics


# Add your own metrics easily

const { metricScope, Unit } = require('aws-embedded-metrics');

exports.handler = metricScope(metrics => async (event, context) => {
  metrics.setNamespace(metricsGroup);
  //...
  metrics.putMetric('Polls Created', 1, Unit.Count);
  metrics.putMetric('Success', 1, Unit.Count);
});

# Bundle before deployment

sam build

# SAM template globals

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-template-anatomy-globals.html

# Activate XRay in CloudFormation

Globals:
  Api:
    TracingEnabled: true
  Function:
    Tracing: "Active"

# Activate XRay in code

const AWSXRay = require('aws-xray-sdk-core'),
	aws = AWSXRay.captureAWS(require('aws-sdk'));

AWSXRay.setContextMissingStrategy(() => {});


# NodeJS - cache connections

AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1

# CloudFormation conditions

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html

# Use conditions to switch XRay On/Off

Parameters:
  XRay:
    Type: String
    Default: ''
    Description: 'Use X-Ray to profile requests'
Conditions:
  UseXray: !Equals ['yes', !Ref XRay]
Globals:
  Api:
    TracingEnabled: !If [UseXray, true, false ]
  Function:
    Tracing: !If [UseXray, "Active", "PassThrough"]
