# Altran-CFC-Covid-19
Altran Entry for Call for Code - Covid-19 Challenge

# Submission name

Health Assistant - Details about submission name - TBD

## Contents

1. [Short description](#short-description)
1. [Demo video](#demo-video)
1. [The architecture](#the-architecture)
1. [Long description](#long-description)
1. [Project roadmap](#project-roadmap)
1. [Getting started](#getting-started)
1. [Running the tests](#running-the-tests)
1. [Live demo](#live-demo)
1. [Built with](#built-with)
1. [Contributing](#contributing)
1. [Versioning](#versioning)
1. [Authors](#authors)
1. [License](#license)
1. [Acknowledgments](#acknowledgments)

## Short description

TBD

### What's the problem?

In these unprecedented times, health care systems are getting overwhelmed with patients having Covid-19 symptoms all over the world. It is becoming very difficult for doctors to handle every patient with these symptoms. 

### How can technology help?

We are trying to bring technology to the rescue of health care systems all over the world so that they are able to cope up with the massive inflow of patients with Covid-19 symptoms. 

### The idea

TBD

## Demo video

TBD

## The architecture

TBD

## Long description

TBD

## Project roadmap

TBD

## Getting started

To get started take clone of following repository to your local machine.

- https://github.com/hackaltran/CFC_API
- https://github.com/hackaltran/CFC_UI
- https://github.com/hackaltran/CFC_Monitoring
- https://github.com/hackaltran/CFC_MonitoringUI

### Prerequisites

Before installing the application, you ensure following tools should be installed in your machine.
```bash
node v10 or above
docker v19 or above
IBM cli
IBM cloud account
```

### Installing
###### creating Docker image 

 The following command will be use to deploy the application on IBM Cloud kubernetes cluster

 Before executing the command, you need to create a registry on IBM Cloud.
 ```
   we are using cfc_altran as registry.
   Below are the steps to create registry (https://cloud.ibm.com/docs/Registry?topic=registry-getting-started#gs_registry_cli_install)
   Log in to IBM Cloud => ibmcloud login
   Add a namespace to create your own image repository => ibmcloud cr namespace-add cfc_altran
   To ensure that your namespace is created => ibmcloud cr namespace-list

 
  ```
  > You have to run these command alongside dockerfile.
```bash

# Building new ubuntu image using Dockerfile to deploy CFC_API code on it
docker build -t cfc-nodejs-app .

# Tag docker image to upload to IBM Cloud Kubernetes cluster
docker tag cfc-nodejs-app us.icr.io/cfc_altran/cfc-nodejs-repo

# Try IBM cloud login to be on safe side
ibmcloud cr login

# To be on safe side, update region also
ibmcloud cr region-set us-south

# Push docker image to IBM Cloud Kubernetes cluster
docker push us.icr.io/cfc_altran/cfc-nodejs-repo

# After push, list image present on IBM Cloud to confirm
ibmcloud cr image-list

```
###### Kubernets installation

- Below commands need to be executed manually on IBM Cloud via browser based 'Kubernetes Terminal'
- Go to Clusters on IBM Cloud -> click the cluster -> 'Add-ons' -> click 'Install' for 'Kubernetes Terminal'
 - This will start installation and when button label change to 'Terminal', click on it to open terminal'
 ```bash

# Start
kubectl run cfcaltran2020 --image=us.icr.io/cfc_altran/cfc-nodejs-repo:latest

# Expose your application to the internet
kubectl expose deployment/cfcaltran2020 --type=NodePort --port=8080 --name=cfcaltran2020-service --target-port=8080

# Get the NodePort and use it for all requests.
# Application will listen on NodePort only and not on port specified while starting the NodeJS application.
kubectl describe service cfcaltran2020-service

# Get the Worker node Public IP on which request will be hit
ibmcloud ks workers cfc_nodejs_cluster

# Below is example GET API call
# curl -kX GET http://<ip>:<port>/api/patient/<patientIP>
 ```


## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why, if you were using something like `mocha` for instnance

```bash
npm install mocha --save-dev
vi test/test.js
./node_modules/mocha/bin/mocha
```

### And coding style tests

Explain what these tests test and why, if you chose `eslint` for example

```bash
npm install eslint --save-dev
npx eslint --init
npx eslint sample-file.js
```

## Live demo

TBD

## Built with

NodeJS
ReactJS
React-Native

## Contributing

TBD

## Versioning

## Authors

Deepak Bammi
Manoj Gupta

## License

TBD

## Acknowledgments

TBD
 
