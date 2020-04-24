## Getting started

### Prerequisites

Before starting the installation, ensure following tools have been installed on user local system. 

- Node.js v10 or above
```
https://nodejs.org/en/
```


### Installation

#### Step 1- Updating the URL for Monitoring API:

Go to /src/services/webservices.js file and update the BASE_URL with the generated URL of Monitor chatbot API.

#### Step 2- Build using npm 

Open command window/terminal and run the following command
```
npm run build
```
A build folder will be created in the root directory.

#### Step 3- Deploy the build folder on IBM Cloud using the following URL 

```
https://cloud.ibm.com/developer/appservice/create-app
```
