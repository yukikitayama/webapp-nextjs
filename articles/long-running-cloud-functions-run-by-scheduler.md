Cloud Functions timeout is, by default set to be **1 minute**. But we can configure it up to **9 minutes**

Cloud Run timeout is, by default **5 minutes**, and can be extended to **60 minutes**.

## Cloud Scheduler Timeout

I could't find the Google Cloud online documentation about Cloud Scheduler timeout.

But by below commands, `jobs list` allow us to identify the Cloud Scheduler job you created, and `jobs describe JOB_NAME` display the timeout of the job. And we are able to know the defualt timeout of Cloud Scheduler is `180s` meaning **3 minutes**.

```
$ gcloud scheduler jobs list
$ gcloud scheduler jobs describe JOB_NAME
```

There is no way to know the timeout from Google Cloud Console, and no way to change it. We need to use the following commands. Replace `XXXs` with your desired seconds.

```
$ gcloud scheduler jobs update http JOB_NAME --attempt-deadline XXXs
```

When we try number more than `1800s`, it returns an error, and we will know the maximum timeout of Cloud Scheduler is **30 minutes**.

## When Exceeding Cloud Scheduler Timeout

If Cloud Functions and Cloud Run finish within their timeouts, but if the time exceeds **3 minutes** (the default timeout of Cloud Scheduler) or **30 minutes** (max timeout of Cloud Scheduler), Cloud Scheduler displays **failed** in console, but Cloud Functions and Run are successfully finished.

## Reference

- [Cloud Functions Execution Environment](https://cloud.google.com/functions/docs/concepts/exec)
- [Setting request timeout | Cloud Run](https://cloud.google.com/run/docs/configuring/request-timeout)
- [GCP Cloud Scheduler throws ERROR for a HTTP targettype](https://stackoverflow.com/questions/59024925/gcp-cloud-scheduler-throws-error-for-a-http-targettype)