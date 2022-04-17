## Big Picture

I use **Cloud Run** when I want to use **Linux**, install system packages, run Python codes, lower cost, and avoid managing infrastructure. It sounds like we can achieve the same as we use **Cloud Functions**. But Cloud Functions doesn't allow us to modify system packages. Cloud Run has a longer timeout and bigger memory too. So I think that I use Cloud Run when I wanna do something more than Cloud Functions. The big picture is,

- Upload the **container image** to Google Cloud **Container Registry**
- Deploy the image from Container registry to **Cloud Run**

## Upload Container Image

We will use **Python**. We need to prepare the following 4 things.

- Python code
- Python requirements text file
- Docker configuration file
- Docker ignore file

Upload the files to **Container Registry**. Replace `PROJECT_ID` with yours. You can choose your preference for `REGION`, such as `us-central1`. You can newly name yours in `IMAGE_NAME`.

```
$ gcloud builds submit --region=REGION --tag gcr.io/PROJECT_ID/IMAGE_NAME
```

## Deploy Cloud Run

Newly name your Cloud Run service in `SERVICE`. `PROJECT_ID` and `IMAGE_NAME` should match up with what we made above.

```
$ gcloud run deploy SERVICE --image gcr.io/PROJECT_ID/IMAGE_NAME
```

## Run Cloud Run

- URL
- Cloud Scheduler

## Configure the Service

Permission

Each service of Cloud Run is assigned **service account**. By default, it's **compute engine default service account**. For example, by default, the Python code in Cloud Run can interact with **BigQuery**.

If we want to make the Cloud Run private, configure **authentication** to be **require authentication**, and **ingress** to be **allow all traffic**. And make a **service account** and assign **Cloud Run invoker** role `roles/run.invoker`. So only the resource with this role can run the private Cloud Run. We can use `--no-allow-unauthenticated` too when deploying in **gcloud**.

```
$ gcloud run deploy SERVICE --image gcr.io/PROJECT_ID/IMAGE_NAME --no-allow-unauthenticated --region us-central1
```

In **Cloud Scheduler**, use `Add OIDC token` for `Auth header`, and choose the service account with Cloud Run invoker role. Copy and paste the same Cloud Run trigger URL to `Audience`. Specify the `HTTP method` that we defined in the Python code.

So we have 2 service accounts idea. One who is doing something in Cloud Run, and the other who runs the Cloud Run.

By default, Cloud Run memory is about **500 MB**. If your Cloud Run process the huge data and if it exceeds the memory, Cloud Run crashes during execution. So you need to edit the configuration.

By default, Cloud Run timeout is **5 minutes**. If your Cloud Run is long-running process, it doesn't finish and fail. So you need to edit the configuration.

## Update Cloud Run

Update the container registry again, and deploy it from Container registry to Cloud Run again.

## GitHub

[]()

## Resource

- [Deploy a Python service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service)
- [Building with a Dockerfile | Building container images](https://cloud.google.com/build/docs/building/build-containers#use-dockerfile)
- [Running services on a schedule](https://cloud.google.com/run/docs/triggering/using-scheduler)
- [gcloud run deploy](https://cloud.google.com/sdk/gcloud/reference/run/deploy)