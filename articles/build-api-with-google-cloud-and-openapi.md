
## Big Picture

- Cloud Endpoints works as the front end of API.
- Cloud Functions works as the backend system of API.
- Use OpenAPI to configure API.

## Cost

Unless you use this API with super high frequency, it's **free**.

## Make Cloud Functions

Let's make the Cloud Functions first. This is what our API actually does for API users. For example, providing some data to API users, or allowing the users to upload their data to database. I shows the framework code for the Cloud Functions as the API backend, and explain the detail later. In practice, your API is likely to interact with the database. But the below code doesn't include that part for the demo purpose, but you can replace.

```python
import json
import pprint


def main(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET and POST requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return '', 204, headers

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if request.method == 'GET':
        message = 'API received GET request.'
        return json.dumps({'message': message}), 200, headers

    elif request.method == 'POST':
        content_type = request.headers['content-type']
        request_body = None
        if content_type == 'application/json':
            request_body = request.get_json()['body']
        # Uploading data like CSV is text/plain
        elif content_type == 'text/plain':
            # Decode it to string data because the data is byte if text/plain
            request_body = request.data.decode('utf-8')
        message = f'API received POST request with the data: {request_body}'
        return json.dumps({'message': message}), 200, headers
```

The key part is how the Cloud Functions handles the **HTTP request methods**, **POST request body data**, and **CORS error**. CORS is something for using API from a browser. It's not necessary if our API is used in the backend system. But if you want to use the API in the frontend, for example in **React** or **Angular**, it's necessary to handle CORS. 

In deployment, Cloud Functions automatically receive one argument `request` object in the main function. This object has an attribute `request.method`, which allow us to identify what HTTP request method was used to invoke the Cloud Functions. Later, in the OpenAPI configuration file, we have to define separate configurations for different HTTP request methods, but in Cloud Functions, one function can handle multiple types of HTTP request methods.

Cloud Functions can receive the body data which comes from HTTP POST request. If the body data uses **JSON** by `application/json`, the data is available in `request.get_json()`. It returns a dictionary object in Python. The key depends on the JSON that we pass when we call the API. The above assumes that API users pass JSON of `{ "body": "SOME-KIND-OF-DATA" }`.

To handle **CORS error**, we need to implement the 2 things; one in Cloud Functions, and the other in Cloud Endpoints OpenAPI configuration.

Cloud Functions can be private. We don't need to allow unauthenticated access, but Cloud Endpoints still can invoke the Cloud Functions.

## Make Cloud Run Services

This will be a container to run Cloud Endpoints API frontend. Replace `CLOUD-RUN-SERVICE-NAME` and `PROJECT-NAME` with yours. Running the below outputs **Service URL**, which we can take a memo because we need it to configure API.

```
$ gcloud run deploy CLOUD-RUN-SERVICE-NAME \
> --image="gcr.io/cloudrun/hello" \
> --allow-unauthenticated \
> --platform managed \
> --project=PROJECT-NAME
```

## Create OpenAPI Configuration File

Cloud Endpoints allows us to use **OpenAPI** to define our API. 

We will upload this file later to Cloud Endpoints.

API key for authentication

In the API context, authentication means that we wanna allow only the authenticated users to use a part of API paths or the entire API. 

I think using **API key** is the easiest and quick way to implement authentication. We can issue the API key in Google Cloud. 

Google Cloud console menu &rarr; APIs & Services &rarr; Credentials &rarr; Create credentials &rarr; API key

CORS

Make the GET request public, but make the POST request private, requiring API key. 

I will first shows the example of OpenAPI configuration file, and explain the details.

```yaml
swagger: '2.0'
info:
  title: Demo API
  description: This API is for demo.
  version: 0.0.0
host: CLOUD-ENDPOINTS-SERVICE-NAME
x-google-endpoints:
  - name: CLOUD-ENDPOINTS-SERVICE-NAME
    allowCors: True
schemes:
  - https
produces:
  - application/json
security: []
paths:
  /data:
    get:
      summary: Get data
      operationId: dataGet
      x-google-backend:
        address: CLOUD-FUNCTIONS-TRIGGER-URL
      responses:
        '200':
          description: success
    post:
      summary: Post data
      operationId: dataPost
      security:
        - api_key: []
      x-google-backend:
        address: CLOUD-FUNCTIONS-TRIGGER-URL
      responses:
        '200':
          description: success
securityDefinitions:
  api_key:
    type: "apiKey"
    name: "key"
    in: "query"

```

`swagger: '2.0'`. This needs to be `2.0` because, as of 2022-04-13, OpenAPI version is 3, but Cloud Endpoints doesn't support the version 3. Cloud Endpoints supports OpenAPI version 2.

## Deploy API Configuration in Cloud Endpoints

Replace `API-CONFIGURATION-YAML-FILE` and `PROJECT-NAME` with yours. We need the output of **config ID**, which looks like `YYYY-MM-DDrX`.

```
$ gcloud endpoints services deploy API-CONFIGURATION-YAML-FILE --project PROJECT-NAME
```

We need to repeat this step every time we modify the API configuration YAML file to update Cloud Endpoints.

## Enable Google Cloud Services

Replace `ENDPOINTS-SERVICE-NAME` with yours. This step is only once.

```
$ gcloud services enable servicemanagement.googleapis.com
$ gcloud services enable servicecontrol.googleapis.com
$ gcloud services enable endpoints.googleapis.com
$ gcloud services enable ENDPOINTS-SERVICE-NAME
```

## Deploy Cloud Endpoints API to Cloud Run

Get the script to make a container image for Cloud Run from [script](https://github.com/GoogleCloudPlatform/esp-v2/blob/master/docker/serverless/gcloud_build_image). Run the below to make it executable.

```
$ chmod +x gcloud_build_image
```

Replace `CLOUD-RUN-HOSTNAME`, `CONFIG-ID` and `PROJECT-NAME` with yours. `CLOUD-RUN-HOSTNAME` is the string in Cloud Run URL after `https://`, ending with `.run.app`. We need the IMAGES output starting with `gcr.io/`

```
$ ./gcloud_build_image -s CLOUD-RUN-HOSTNAME -c CONFIG-ID -p PROJECT-NAME
```

Replace `CLOUD-RUN-SERVICE-NAME`, `IMAGE`, `PROJECT-NAME` with yours.

```
$ gcloud run deploy CLOUD-RUN-SERVICE-NAME \
> --image="IMAGE" \
> --allow-unauthenticated \
> --platform managed \
> --project=PROJECT-NAME
```

We need to do again this step every time we update the API configuration in Cloud Endpoints, because it issues us a new **config ID**.

## Test API

Linux **CURL** command. Replace `ENDPOINTS-SERVICE-NAME` and `PATH` with yours. Change `request method` and `headers` depending on your API configuration.

```
$ curl --request GET \
> --headers "content-type:application/json" \
> "https://ENDPOINTS-SERVICE-NAME/PATH"
```

Postman

**Python** **requests** package.

## Update API

Update Cloud Functions code and deploy

Update OpenAPI API configuration file, and deploy it to Cloud Endpoints again.

Deploy the new API configuration to Cloud Run again.

```
$ gcloud endpoints services deploy API-CONFIGURATION-YAML-FILE --project PROJECT-NAME

$ ./gcloud_build_image -s CLOUD-RUN-HOSTNAME -c CONFIG-ID -p PROJECT-NAME

$ gcloud run deploy CLOUD-RUN-SERVICE-NAME \
> --image="IMAGE" \
> --allow-unauthenticated \
> --platform managed \
> --project=PROJECT-NAME
```

## Resource

- [Set up Cloud Endpoints OpenAPI for Cloud Functions with ESPv2](https://cloud.google.com/endpoints/docs/openapi/set-up-cloud-functions-espv2)
- [HTTP Functions](https://cloud.google.com/functions/docs/writing/http)
- [HTTP request body](https://cloud.google.com/functions/docs/samples/functions-http-content)
- [Choosing an Authentication Method](https://cloud.google.com/endpoints/docs/openapi/authentication-method)
- [Restricting API access with API keys](https://cloud.google.com/endpoints/docs/openapi/restricting-api-access-with-api-keys)
- [Enabling CORS support for Endpoints](https://cloud.google.com/endpoints/docs/openapi/support-cors)