#!/bin/sh

# This script will deploy the application on IBM Cloud kubernetes cluster

# Before running the script, you need to create a registry on IBM Cloud.
# I have created cfc_altran2020 to use in this script.
# Below are the steps to create registry (https://cloud.ibm.com/docs/Registry?topic=registry-getting-started#gs_registry_cli_install)
# Log in to IBM Cloud => ibmcloud login
# Add a namespace to create your own image repository => ibmcloud cr namespace-add cfc_altran2020
# To ensure that your namespace is created => ibmcloud cr namespace-list

# You have to run this script alongside dockerfile.

# Building new ubuntu image using Dockerfile to deploy CFC_API code on it
docker build -t cfc-monitor-nodejs-app .

# Tag docker image to upload to IBM Cloud Kubernetes cluster
docker tag cfc-monitor-nodejs-app us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo

# Try IBM cloud login to be on safe side
ibmcloud cr login

# To be on safe side, update region also
ibmcloud cr region-set us-south

# Push docker image to IBM Cloud Kubernetes cluster
docker push us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo

# After push, list image present on IBM Cloud to confirm
ibmcloud cr image-list

# Trigger the cluster creation on IBM Cloud as it will take time

# NOTE: Below commands need to be executed manually on IBM CLoud via browser based 'Kubernetes Terminal'
# Go to Clusters on IBM Cloud -> click the cluster -> 'Add-ons' -> click 'Install' for 'Kubernetes Terminal'
# This will start installation and when button label change to 'Terminal', click on it to open terminal'

# Delete the respective deployment & service if already exists
kubectl delete deployment cfcaltran2020
kubectl delete service cfcaltran2020-service

# Start
kubectl run cfcaltran2020 --image=us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo:latest

# Display PODs details
kubectl get pods

# Expose your application to the internet
kubectl expose deployment/cfcaltran2020 --type=NodePort --port=3000 --name=cfcaltran2020-service --target-port=3000

# Get the NodePort and use it for all requests.
# Application will listen on NodePort only and not on port specified while starting the NodeJS application.
kubectl describe service cfcaltran2020-service

# Get the Worker node Public IP on which request will be hit
ibmcloud ks workers cfc_monitor_nodejs_cluster

# Below is example GET API call
# curl -kX GET http://184.172.241.130:32565/doctors
