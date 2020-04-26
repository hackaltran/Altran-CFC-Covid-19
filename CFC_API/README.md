## Getting started

### Prerequisites

Before starting the installation, ensure user have the IBM Cloud account to create Kubernetes Service. Also following tools have been installed on user local system. 

- Node.js v10 or above
```
https://nodejs.org/en/
```
- Docker v19 or above
```
https://www.docker.com/products/docker-desktop
```
- IBM Cloud command line interface
```
https://cloud.ibm.com/docs/cli?topic=cloud-cli-install-ibmcloud-cli
```


### Installation

#### Installing Patient Backend service:
Below Steps will be used to create your own image repository, build the Docker image and finally deploy on the IBM Cloud Kubernetes cluster

##### step 1- Creating image repository on IBM Cloud 

Before building the Docker image, first you need to add a namespace to create your own image repository on IBM Cloud.

Below commands are using 'cfc_altran' as registry. Note that it needs to be unique.

- Log in to IBM Cloud 
```
ibmcloud login
```
- Upon successful login, add a namespace to create your own image repository
```
ibmcloud cr namespace-add cfc_altran
```
- To ensure that your namespace is created, look for registry name in the command output 
```
ibmcloud cr namespace-list
```
##### Step 2- Creating Docker image

You have to run these command alongside Dockerfile.

- Building new ubuntu image using Dockerfile to deploy CFC_API code on it
```
docker build -t cfc-nodejs-app .
```
- Tag docker image to upload to IBM Cloud Kubernetes cluster
```
docker tag cfc-nodejs-app us.icr.io/cfc_altran/cfc-nodejs-repo
```
- [_Optional step_] Try IBM Cloud Registry login to validate user and region 
```
ibmcloud cr login
```
- [_Optional step_] Update region to ensure that image is uploaded under correct region
```
ibmcloud cr region-set us-south
```
- Push docker image to IBM Cloud Registry
```
docker push us.icr.io/cfc_altran/cfc-nodejs-repo
```
- List image present on IBM Cloud Registry and ensure respective image is there in command output
```
ibmcloud cr image-list
```
##### Step 3- Kubernetes installation

__NOTE__: Below commands need to be executed manually on IBM Cloud via browser based 'Kubernetes Terminal'

`Go to Clusters on IBM Cloud -> click the cluster -> click 'Add-ons' -> click 'Install' for 'Kubernetes Terminal'`

This will start installation and when button label change to 'Terminal', click on it to open terminal'

- [In case of redeployment] Delete the respective deployment & service if already exists
```
kubectl delete deployment cfcaltran2020
kubectl delete service cfcaltran2020-service
```
- Start/Create the deployment
```
kubectl run cfcaltran2020 --image=us.icr.io/cfc_altran/cfc-nodejs-repo:latest
```
- Expose your application to the internet
```
kubectl expose deployment/cfcaltran2020 --type=NodePort --port=8080 --name=cfcaltran2020-service --target-port=8080
```
- Get the NodePort and use it for all requests. Application will listen on NodePort only and not on port specified while starting the NodeJS application.
```
kubectl describe service cfcaltran2020-service
```
- Get the Worker node Public IP on which request will be hit
```
ibmcloud ks workers cfc_nodejs_cluster
```
- Below is example GET API call
```
curl -kX GET https://<ip>:<port>/api/patient/<patientIP>
```
__NOTE__: The public url must be secure having HTTPS protocol.

 ## API Overview
 
 PatientBaseURL 		
http://184.172.241.147:30222		
		
| Action |	Method Type |	Request |
|---|---|---|
| `/api/user/signup`|	`Post` | `{ "name" : String, "gender" : String, "age" : Integer, "mobileno" : String, "location" : {"lat": String,  "lang"": String  }}`|
|`/api/user/signin`|	`Post`|	`{ "id": String, "password": String }`|
|`/api/user/userid`|	`Get`| 
|`/api/patient/addsymptom`|	`Post`|	`{"user_id": String,"gender": String, "family": String, "travelled": String, "experience": String, "heart_rate":  String, "temperature":  String, "breathing_rate": String }`| 
