---
id: "article:19"
---

## Big Picture

The most important part of automating Slack is to use **Slack API** to interact with Slack services, such as sending a message, not by human manually opening the Slack App and typing messages. So the big picture is,

- Create **Slack App** online and configure the necessary setups.
- Write the code using **Slack API** to interact with Slack. 
- Automate running the code by cloud resources, such as **AWS**

## Create Workspace

If your company already has a Slack workspace and you daily use the app, you can skip this step. If you are new to Slack, you need to create the workspace before using Slack API. Make it from [Slack web page](https://slack.com/). It's **free**.

## Create App

To use **Slack API**, we need to register **Slack App** online in Slack web page. It doesn't require anything special or technical. It's **free**.

[Your Apps](https://api.slack.com/apps) &rarr; Click "Create an App" &rarr; From scratch &rarr; App Name &rarr; Pick a workspace

## Configure App

By default, the app we just created does not have any permissions to do. We need to configure the App, for example, to allow the app to send a message to a channel.

Select your app at [Your Apps](https://api.slack.com/apps) &rarr; Left side menu &rarr; Features &rarr; OAuth & Permissions &rarr; Scopes &rarr; Bot Token Scopes &rarr; Add an OAuth Scope

Permissions depend on what we want our app to do. For example, if we want app to send message to channel, we need to assign `chat:write` scope to our bot. If we want app to upload a file, bot needs `files:write`. We can know what permissions are needed by looking at Slack API online documentation. For example, [chat.postMessage](https://api.slack.com/methods/chat.postMessage)

Without this step, you cannot install app to worksapce. You will see the error message saying `Please add at least one feature or permission scope to install your app`.

## Install App to Workspace and Get Token

Slack says installation, but it doesn't require installing some software to somewhere. I feel it's just connecting our app to our slack space. This step results in giving us the **token** for Slack API.

Select your app at [Your Apps](https://api.slack.com/apps) &rarr; Left side menu &rarr; Settings &rarr; Install App &rarr; Install to Workspace &rarr; Click Allow to `APP_NAME is requesting permission to access the WORKSPACE_NAME Slack workspace`.

Eventually, Slack API web page shows us the **OAuth Tokens** for our workspace. We need this string of **Bot User OAuth Token** to run Slack API.

## Invite the App to a Channel

This is a step that people often forget. In the following sections, we will write some code to make our app do something to a channel. But the app will not automatically join a channel. We need to select a channel and manually invite the app to the channel.

To invite an app to a channel, `/invite @APP_NAME` in slack window of a specific channel.

![Invite app screenshot {362x196}](/images/article/automate-slack-by-slack-api/invite_app_to_channel.png)

For example, when you run Slack API to post a message to a channel, if the App is not in the channel in advance, you will receive the following error

```
{
    "ok": false,
    "error": "not_in_channel"
}
```

## Slack API

We are ready to use Slack API. Slack API has a set of API endpoints. The following code is the example of posting a message to a channel. You can find the detail at [chat.postMessage](https://api.slack.com/methods/chat.postMessage). In the web page, there is also endpoint tester. Becuase it's just an API endpoints, there is no contraint which programming language to use. Here, I used **Python** and [requests package](https://docs.python-requests.org/en/latest/).

Replace `BOT_USER_OAUTH_TOKEN` with your token that you obtained in the above step. Also replace `#CHANNEL_NAME` with the channel you have.

```python
import requests
import pprint


TOKEN = 'BOT_USER_OAUTH_TOKEN'
CHANNEL = '#CHANNEL_NAME'


def main():

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Bearer {TOKEN}'
    }
    payload = {
        'channel': CHANNEL,
        'text': 'This is a test message.'
    }
    r = requests.post(
        url='https://slack.com/api/chat.postMessage',
        headers=headers,
        params=payload
    )
    print(f'Status code: {r.status_code}')
    print('Response JSON')
    pprint.pprint(r.json())


if __name__ == '__main__':
    main()
```

## Slack SDK for Python

Slack provide us the **SDK** for a few selected languages. **Python** is one of them. This allows us to make a simpler code, because we can use methonds and functions of the SDK. But the functionality is the same.

To use **Slack SDK** for python, install Python package in your terminal.

```
$ pip install slack_sdk
```

This is the Python code excample to send a message and upload a file to a Slack channel

```python
from slack_sdk import WebClient
import boto3
import json


TOKEN = 'BOT_USER_OAUTH_TOKEN'
CHANNEL = '#CHANNEL_NAME'


def main():

    # Post message by Slack SDK client
    client = WebClient(token=TOKEN)
    text = 'Test for sending a message by Slack SDK'
    response = client.chat_postMessage(channel=CHANNEL, text=text)
    print('Post message response')
    print(response)
    print()

    # Make a CSV file to test uploading files
    content = 'This is a text content for CSV'
    f = open('./test.csv', 'w')
    f.write(content)
    f.close()

    # Upload CSV file to Slack channel
    message = 'This message is shown together with the uploaded file'
    filename = 'test.csv'
    response = client.files_upload(
        channels=CHANNEL,
        file=CSV,
        filename=filename,
        initial_comment=message
    )
    print('Upload file response')
    print(response)
    print()


if __name__ == '__main__':
    main()
```

## Automate Running Slack API by AWS

Because we already have Python code from above, we can upload the code to **AWS Lambda** by either **AWS Console** or **AWS CLI** to allow the AWS to run our code. We can also use **Amazon EventBridge** to run the Lambda. We specify cronjob style syntax to schedule running the code. I like this Lambda and EventBridge combination, because it's quick to implement, and unless you run the code super high frequency, the cost is very likely to be **free**.

Please use the links to AWS online documentation in the Resource section for detail.

## GitHub

If you wanna check code, please go to my GitHub repo: [yukikitayama/slack](https://github.com/yukikitayama/slack)

## Resource

- [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
- [files.upload](https://api.slack.com/methods/files.upload)
- [Python Slack SDK | GitHub](https://github.com/slackapi/python-slack-sdk)
- [Python Slack SDK | slack api](https://slack.dev/python-slack-sdk/index.html)
- [Building Lambda functions with Python](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html)
- [Tutorial: Schedule AWS Lambda functions using EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-run-lambda-schedule.html)
