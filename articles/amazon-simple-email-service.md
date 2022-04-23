
## Big Picture

- In AWS SES Console and Route 53, create and verify the domain.
- In AWS SES Console and your email index, create and verify the email address.
- Test sending email from AWS SES Console
- Make a real email in Python and send it by Python AWS SDK

## Setting Up SES

- Create a domain identity and verify domain
  - Creation is required even if you already have domain at Route 53)
  - When the domain is from Route 53, this will be done automatically.
- By default, SES is in the **sandbox**
  - You can send only 200 emails per day
  - You can send only 1 email per second
  - You can send only to verified email address.
- Verify your email
  - Amazon SES &rarr; Left side menu &rarr; Verified identities &rarr; Create identity &rarr; Register your email address.

## Test Sending Email from SES Console

1. Amazon SES
2. Configuration at the left menu
3. Verified identities
4. `Send test email` after selecting an domain identity
5. Scenario `Custom`
6. Type your verified email in `Custom recipient`.

## Send Email by SES AWS SDK for Python

To make the sender's name appear correctly in inbox, use `NAME <SENDER_EMAIL_ADDRESS>`

For example, using sender `noreply@test.com` will show `noreply` as the sender name in inbox.

If we use `Person Test <noreply@test.com>` will show `Person Test` as the sender name in inbox.

Python code example using SES is found in [here](https://docs.aws.amazon.com/ses/latest/dg/send-an-email-using-sdk-programmatically.html#send-an-email-using-sdk-programmatically-examples).

boto3 SES send email API documentation is [here](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ses.html#SES.Client.send_email)

Replace `RECIPIENT@EMAIL.COM` and `SENDER@EMAIL.COM` with yours.

```python
import boto3

client = boto3.client('ses')

email_subject = 'Test sending email by SES Python API'

email_body = \
    '<html>' \
    '<head></head>' \
    '<body>' \
    '  <h1>This is h1 HTML element</h1>' \
    '  <p>This is p HTML element</p>' \
    '</body>' \
    '</html>'

response = client.send_email(
    Destination={'ToAddresses': ['RECIPIENT@EMAIL.COM']},
    Message={
        'Subject': {
            'Charset': 'UTF-8',
            'Data': email_subject
        },
        'Body': {
            'Charset': 'UTF-8',
            'Data': email_body
        }
    },
    Source='SENDER@EMAIL.COM'
)

print(f'Message ID: {response["MessageId"]}')
```

![Gmail receive email from SES {623x388}]('/images/article/send-email-from-aws-with-your-domain-name/gmail_receive_email_from_ses.png')

## Email Format

The email that SES makes has

- Header
  - Sender address
  - Recipient address
  - Subject
  - Date
- Body
  - Text of message. The format could be **HTML**, plain text, or both
- Envelope
  - ???

## Terminology

- DKIM
  - DomainKeys Identified Mail
  - Email authentication method that SES uses to verify domain ownership.

## Reference

- [mail format in Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/send-email-concepts-email-format.html)
- [Python Amazon SES email and identity example](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/python/example_code/ses)
- [Creating and verifying identities in Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-domain-procedure)
  - To use our domain in SES
- [Moving out of the Amazon SES sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)
- [Creating an email address identity](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-email-addresses-procedure)
- [Sending email through Amazon SES using an AWS SDK](https://docs.aws.amazon.com/ses/latest/dg/send-an-email-using-sdk-programmatically.html)