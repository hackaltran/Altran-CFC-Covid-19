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
- Kubernetes cluster on IBM cloud with cluster name as ‘cfc_monitor_nodejs_cluster’

__Note :__ Ensure that ‘container-registry’ plugin is installed as part of IBM Cloud command line interface installation. If not, then please add the plugin separately.

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

- Building new ubuntu image using Dockerfile to deploy CFC_Monitoring code on it
```
docker build -t cfc-monitor-nodejs-app .
```
- Tag docker image to upload to IBM Cloud Kubernetes cluster
```
docker tag cfc-monitor-nodejs-app us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo
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
docker push us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo
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
kubectl run cfcaltran2020 --image=us.icr.io/cfc_altran2020/cfc-monitor-nodejs-repo:latest
```
- Display PODs details
```
kubectl get pods
```
- Expose your application to the internet
```
kubectl expose deployment/cfcaltran2020 --type=NodePort --port=3000 --name=cfcaltran2020-service --target-port=3000
```
- Get the NodePort and use it for all requests. Application will listen on NodePort only and not on port specified while starting the NodeJS application.
```
kubectl describe service cfcaltran2020-service
```
- Get the Worker node Public IP on which request will be hit
```
ibmcloud ks workers cfc_monitor_nodejs_cluster
```
- Below is example GET API call
```
curl -kX GET https://<ip>:<port>/doctors
```
__NOTE__: The public url must be secure having HTTPS protocol.

## API Overview
 
MonitorAPI BaseURL: 
`https://c4c-monitorapi.df.r.appspot.com/`
		
| Action |	Method Type |	Request |
|---|---|---|
| `/doctors`| `Get` |
| `/doctors/:statusId/:doctorId` | `Get`| 
|`/patients/:patientId`| `Get`| 
|`/patients/status/:statusId`| `Get`| 
| `/login`|	`Post` | `{ "username": String, "password":String }`|
|` /patients/assign-doctor/:patientId`|`Put`| `{ "doctorId": String, "operatorId": String, "timestamp": String, "operatorName": String }`|
|`/patients/comment/:patientId`|`Post`|`{ "comment": String, "timestamp": String, "doctor": String }`|
|`patients/assign-risk/:patientId`|`Put`|` { "risk": String }`|
|`/patients/assign-quarantine/:patientId`|`Put`|`{ "isQuarantine": Boolean }`|
`


