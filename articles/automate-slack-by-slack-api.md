## Big Picture

- Create a **Workspace**
- Create an **App**
- Configure the App
- Install the App to workspace and get **token**
- Use **Slack REST API** or **Slack SDK** to actually do something
- Automate running API by cloud resources, such as **AWS**

## Create Workspace

- Name your company or team
  - Safe to uncheck "Let anyone with an @xxx.com email join this workspace."

## Create App

- [Your Apps](https://api.slack.com/apps)
- Click "Create an App"
- From scratch
- App Name
- Pick a workspace

## Configure App

By default, the app we just created does not have any permissions to do. So first we need to configure the App. For example, we want app to send a message to a channel.

- Left side menu -> Features -> OAuth & Permissions -> Scopes -> Bot Token Scopes -> Add an OAuth Scope

Permissions depend on what we want our app to do. For example, when we want app to send message to channel, bot needs `chat:write` scope.

When we want app to upload a file, bot needs `files:write`

[chat.postMessage](https://api.slack.com/methods/chat.postMessage)

Without this step, you cannot install app to worksapce. You will see the message saying "Please add at least one feature or permission scope to install your app."

## Install App to Workspace

- Left side menu -> Settings -> Install App -> Install to Workspace

Click Allow to APP_NAME is requesting permission to access the WORKSPACE_NAME Slack workspace

Slack API web page shows us the **OAuth Tokens** for our workspace.

We need the string of **Bot User OAuth Token** to run Slack API.

## Generate Token

Something that we need to interact with the Slack API.

- Settings -> Install App

## Invite the App to a Channel

This is an important step if our App needs to interact with a certain channel in Slack. Also, this is the common step that you forget.

`/invite @APP_NAME` in slack window in a specific channel.

For example, when you run Slack API to post a message to a channel, if the App is not in the channel in advance, you will receive the following error

```
{
    "ok": false,
    "error": "not_in_channel"
}
```

## REST API

There is Tester in Slack API web page. For example, if you wanna test posting a message to a channel, you can use **Tester** tab in [chat.postMessage](https://api.slack.com/methods/chat.postMessage)

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

## Slack SDK

## Automate Running Slack API by AWS

**AWS Lambda**

**Amazon EventBridge**

## Resource

- [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
- [Slash commands in Slack](https://slack.com/help/articles/201259356-Slash-commands-in-Slack)

