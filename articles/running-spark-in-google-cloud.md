## Dataproc

## Cost

It will be more expensive than other serverless services such as **Cloud Funcitons** and **BigQuery**, because **Dataproc** requires us to own multiple servers in Dataproc cluster and we are billed as long as the Dataproc cluster is on.

But there is a way to control the cost to as small as possible. We can minimize the time that Dataproc cluster is running. Start the cluster when you want to submit Spark jobs, and end the cluster as soon as our Spark jobs are finished.

In practice, Spark jobs should be running automatically, so we should use **Dataproc API** to in sequence start the Cluster, submit a Spark job, wait for the job to finish, and end the cluster. So the cost will be minimized.

## Create Dataproc Cluster

Before submitting Spark job to run PySpark, we need to create **Dataproc cluster**. Cluster is a set of computers that will run our code. 

In creating cluster, we are required to configure the computers. What I care is,

- **Image** to choose my preferable Linxu OS
- **Machine type** because it will affect Spark job processing speed and **cost**
- **Initialization actions** to install the missing Python packages or system packages
- Allow API access to all Google Cloud services in the same project

As we will see later, most of the Python packages are pre-installed by default when creating cluster. But if we find a missing package, we need to do initialization actions to allow our Python code to use all the dependencies.

As soon as the cluster is created, the cluster is running, and billing starts. Make sure to stop the cluster while you are not using.

By default, Dataproc cluster has Python installed, and major Python packages are installed. For example

- All the Google Cloud Python clients like `google-cloud-bigquery` and `google-cloud-storage`.
- Data analysis packages like `pandas`, `numpy`, `matplotlib`, and `seaborn`.
- Frequently used utility packages such as `requests`, `jupyter`, and `pyspark`.

Initialization actions. Replace `PACKAGE_NAME` if we wanna install the missing packages.
```
#! /bin/bash
apt -y update
apt install python-dev
apt install python-pip
pip install PACKAGE_NAME
```

## Submit Spark Job

I found the following 3 ways useful. I use the Python client in the end to automate submitting Spark jobs.

- Google Cloud Console
- Command line by **gcloud**
- Python client for Dataproc API

For submitting job in Console, first we need to upload the Python code to **Cloud Storage**, and specify the **gsutil URL** for `Main python file`.

Note tha to use Spark in Python, we use `import pyspark` and use the pyspark methods in Python code, but we actually can upload any Python code, print outputs and see the log in Dataproc. So before running the real spark jobs, we can upload the Python code to Dataproc to just check whether the Dataproc is working.

```python
import sys
import pkg_resources


def main():
    print(f'Python version: {sys.version}')
    print(f'Installed packages:')
    # key is package name, version is package version number
    for package in sorted([f'{i.key}=={i.version}' for i in pkg_resources.working_set]):
        print(package)


if __name__ == '__main__':
    main()
```

We can find the following output in each job in `Jobs` screen in Dataproc Console.

```
Python version: 3.8.13 | packaged by conda-forge | (default, Mar 25 2022, 06:04:10) 
[GCC 10.3.0]
Installed packages:
access==1.1.3
affine==2.3.1
aiohttp==3.8.1
...
```

We use the following simple Python code to check which Python version is used and what Python packages are pre-installed, because the Python code will use external pacakges, and if some are not installed, we need to configure the Dataproc cluster.

Replace `PYTHON_FILE`, `CLUSTER_NAME`, and `REGION_NAME` such as `us-central1`.

```
$ gcloud dataproc jobs submit pyspark PYTHON_FILE.py --cluster CLUSTER_NAME --region REGION_NAME
```

## Check Result

There is `Jobs` screen in Dataproc Console where we can see the Python `print` output of each PySpark job.

## Automate Dataproc

## Reference

- [ClusterController](https://googleapis.dev/python/dataproc/latest/dataproc_v1/cluster_controller.html)
- [JobController](https://googleapis.dev/python/dataproc/latest/dataproc_v1/job_controller.html)
- [Dataproc pricing](https://cloud.google.com/dataproc/pricing)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
