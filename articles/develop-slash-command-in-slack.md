
## Big Picture

- Register Slash command in our Slack App
- Use Slash command from Slack
- Cloud Functions receive the request and send back the response immediately
- The Cloud Functions submits a message to PubSub to trigger another Cloud Functions which does the actual job
- The other Cloud Functions does something and use Slack API to provide data to Slack.

## Slash Command

The backend is required to send back the response to Slack within **3 seconds**.

## Configure Slack APP

[slack api](https://api.slack.com/) &rarr; Your apps &rarr; Left side menu &rarr; Features Slash Commands &rarr; Create New Command

Copy and paste the Cloud Functions trigger URL to Request URL

Reinstall the App to workspace from slack app web page.

When you created the new command in slack app and reinstall the app to your workspace, automatically the newly created command is available in your workspace slack, modification needed on slack end.

## AWS Lambda ans Slack

In `def lambda_handler(event, context):`, `event['body']` will receive a long string of key-value pairs of request data from Slack. It looks like `key1=value1&key2=value2...`.

`channel_name`

When there's nothing after slash command like `/command` typed in Slack, `event['body']` has `&text=&NEXT_KEY=NEXT_VALUE`.

In practice, the Lambda which receives the request from Slack needs to publish to SNS to invoke another Lambda.

Another Lambda invoked by SNS receives an `event` object, which has a key `Sns` which has a value `{'Message': 'SOME_MESSAGE'}`.

## Cloud Functions and Slack

When Cloud Functions is trigger by HTTP request, the function automatically receives a request object and it contains an attribute `form`. It is a dictionary having the data from Slack. I listed some of the useful items below.

- `request.form['channel_id']` and `request.form['channel_name']`
  - Useful when the Cloud Functions uses Slack API to make some action to a specific channel
- `request.form['command']`
  - When our Slack App has multiple slash commands, Cloud Functions needs to extract the command to identify what action a Slack user is requesting
- `request.form['text']`
  - We are likely to implement differnt actions for a single command like `/command do_a` and `/command do_b`.
  - `do_a` and `do_b` are extracted from `text`.

## Configure Cloud Functions

1. Cloud Functions which receives a request from Slack and return response within 3 seconds
  - Publish message to PubSub
2. Cloud Functions triggered by PubSub
  - Trigger type is Cloud Pub/Sub 

## Speed of Cloud Functions

When receiving request and just response right away, taking about 500 milliseconds.

Taking about 1500 milliseconds when extracting data from request object.

When publishing message to Pub/Sub, taking about 1500 milliseconds.

Once instance is created, response is about 50 milliseconds.

## Resource

- [Slack Tutorial - Slash Commands](https://cloud.google.com/functions/docs/tutorials/slack)
- [Google Cloud Functions - Slack Slash Command sample](https://github.com/GoogleCloudPlatform/python-docs-samples/tree/main/functions/slack)
- [Enabling interactivity with Slash Commands](https://api.slack.com/interactivity/slash-commands)
- [Serverless Slack Bot: Introduction for Integrating Slack Bot with Google Cloud Functions (Part 1)](https://medium.com/@chamal.gomes/serverless-slack-bot-introduction-for-integrating-slack-bot-with-google-cloud-functions-part-1-5a7b808a6d49)
- [Google Cloud Platform — Serverless Slack Bot](https://servian.dev/google-cloud-platform-serverless-slack-bot-c3b3d1c43330)
- [Creating a Slack App in Python on GCP](https://lethain.com/creating-slack-app-python/)
- [Create a Slack slash command with AWS Lambda](https://medium.com/@cu_tech/create-a-slack-slash-command-with-aws-lambda-83fb172f9a74)
- [Verifying requests from Slack](https://api.slack.com/authentication/verifying-requests-from-slack)
- [Module slack_sdk.signature](https://slack.dev/python-slack-sdk/api-docs/slack_sdk/signature/index.html)
- [Enabling interactivity with Slash Commands](https://api.slack.com/interactivity/slash-commands#responding_basic_receipt)
- [Introduction to Flask jsonify](https://www.educba.com/flask-jsonify/)
  - `json.dumps()` vs. `flask.jsonify()`
- [Publishing messages to topics](https://cloud.google.com/pubsub/docs/publisher)
- [Using AWS Lambda environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
- [Working with Amazon SNS with Boto3](https://towardsdatascience.com/working-with-amazon-sns-with-boto3-7acb1347622d)