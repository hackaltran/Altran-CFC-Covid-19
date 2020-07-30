
# Title

#### are you well ?

## Contents

1. [Value Offered](#value-offered)
1. [Demo video](#demo-video)
1. [The architecture](#the-architecture)
1. [Long description](#long-description)
1. [Project roadmap](#project-roadmap)
1. [UX Design](#ux-design)
1. [Getting started](#getting-started)
1. [Deployment model](#deployment-model)
1. [Configuration](#configuration)
1. [Privacy Policy](#privacy-policy)
1. [Live demo](#live-demo)
1. [Built with](#built-with)
1. [Versioning](#versioning)
1. [Authors](#authors)
1. [Acknowledgments](#acknowledgments)

### Value offered

Comprehensive medical assistance system augmenting the stressed mainstream health infrastructure

### How can technology help?

Technology used like IBM Watson, Kubernetus, cloudant database helps rapid development and reuse of reference proven architecture. 

### The idea

Reduce stress on public healthcare services by providing effective care in home isolation for patients in crisis pandenmic situation

## Demo video

- [Demo Video - PATH](https://vimeo.com/412342949)

- [Additional Demo Video - PATH](offering-docs/are%20you%20well_APP_v4.wmv)

## The architecture

![Architecture](tech-docs/architecture.png)

## Long description

The “Are You Well?” application is built on a scalable, extensible, resilient multi-sided platform.  We leverage IBM Watson Assist, IBM Discovery Service, IBM Cloudant DB and other IBM infrastructure services.

The application will aid in combatting COVID-19 by reducing the stress on the over-taxed medical system, accounting for the overall wellness of an individual, providing access to vital information and services, and, eventually, helping us to re-open society.
 
The application is persona-based and addresses the need of a patient, patient assistant, a healthcare provider, and a physician.  Any patient can sign up from their mobile phone and use the available resources. On the application, the patient, aided by Watson Assist, can provide vital symptom information and relevant data and be advised about their infection risk level based on his or her symptoms.  The system evaluates the infection risk and classifies as high, medium, or low, based on symptoms and parameters entered by the patient and the parameter weightage matrix defined by the doctor/health authority. The patient is then advised on the next steps, including an option to connect with a medical professional. This initial, informative interaction occurs outside of a hospital or medical setting to avoid the risk of exposure or transmission and provides peace of mind to the patient.  The patient receives trusted and valuable insight in the safety of their home.

A healthcare provider or physician can assess, monitor, respond to, and advise their patients from an intuitive dashboard. They can examine the details of patient-reported symptoms, prepare physician notes, connect with the patient, and provide a referral to an available medical facility if needed. This allows medical professionals to operate more efficiently and to focus on patient care with more informed insight while also keeping the patient in a safe environment.  With Views, sorts, and reporting spans macro to micro and communication functionality built-in, the result is treatment and patient vectoring that are more informed, more effective and more timely.
 
Beyond the current focus on COVID-19, this application has the potential to be extended to a variety of medical services.  In addition, capabilities like opt-in patient tracking, virus tracing, geo-fencing which can further enhanced the visibility of the disease and improve care of any given population could provide benefits to the worldwide population along with the adaptability for other applications like drug trial wellness monitoring.   The citizen wellness is a primary mission of government, this application can be extended to provide government more comprehensive insight into their commonwealth condition to aid their decision making. 
 
With our core competency and heritage in building user-centered designed enterprise-grade, scalable systems, we have designed and begun to implement a wellness platform that address the immediate challenges and risks posed to every individual by COVID-19.   As the world work to gain control over COVID-19, we will expand this system with a continued focus on resilience, scalability, and extensibility to connect individuals to medical care.  
 
We have completed and will present the overall platform design, flow, and an initial set of application screenshots.

## Project roadmap

##### Detailed Roadmap is available at [PATH](offering-docs/Call%20for%20Code%20Are%20You%20Well%20Platform%20Deck%20Jul%20v1.0.pdf)
Call for Code Are You Well Platform Deck Jul v1.0.pdf
![Roadmap](offering-docs/Call-for-Code-All-is-Well-Platform-C-19.jpg)


## UX Design

| Details                    | URL |
| ------                     | ------ |
| <strong>Introduction</strong> - Designing a seamless experience for the patient and medical practitioners using persona, user journey.                | [Intro.pdf](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/UX_Design/Intro.pdf) |
| <strong>User Persona</strong> - We created a user person to identify the users. There are four types of users.                | [Users.pdf](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/UX_Design/Users.pdf) |
| <strong>Hills</strong> - Hills are statements of intent written as meaningful user outcomes. They tell you where to go, not how to get there, empowering teams to explore breakthrough ideas without losing sight of the goal.                      | [Hills.pdf](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/UX_Design/Hills.pdf) |
| <strong>User Flow</strong> - We created user flows to identify the journey of the user.                   | [UserFlows.pdf](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/UX_Design/UserFlows.pdf) |
| <strong>Visual Design</strong> - This is a visual design flow of all four users. We are showing all user's journey here.             | [VisualScreenFlows.pdf](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/UX_Design/VisualScreenFlows.pdf) |
| <strong>Prototype</strong> - This is a clickable prototype for Mobile App/ Website which gives an idea of how a user will interact with the App/website.                  | [Mobile App Screen](https://xd.adobe.com/view/badd3b96-443f-442c-4b17-1f791ae99b8e-ccec/)
|                            |[Medical Assistant Screen](https://xd.adobe.com/view/ea338b94-c972-494b-75f7-29a5e62a8cb2-9c02/ )
|                            |[Doctor's Screen](https://xd.adobe.com/view/23568715-1447-49cf-7068-e440efe897ad-5567/)|



## Getting started

To get started with Health Assistant solution, you can choose any of the following two approaches - 

#### Approach 1 : Build and compile the solution
Take git clone at a location of your choice on your system.

```
   git clone https://github.com/hackaltran/Altran-CFC-Covid-19.git
```
After clone verify the following folders :

- CFC_API : Patient Backend Service
- CFC_UI : Patient App
- CFC_Monitoring : Monitoring Backend Service
- CFC_MonitoringUI : Moniroting Dashboard

Use the README.md files to build and compile solutions as mentioned below -

| Solution                   | README |
| ------                     | ------ |
| Patient Backend Service    | [README.md](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_API/README.md) |
| Patient App                | [README.md](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_UI/README.md) |
| Monitoring Backend Service | [README.md](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_Monitoring/README.md) |
| Moniroting Dashboard       | [README.md](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_MonitoringUI/README.md) |

#### Approach 2 : Use the existing deployed infrastructure 

Use the following URL's to access the existing infrastructure -

| Infrastructure             | Deployment |
| ------                     | ------ |
| Patient Backend Service    | [Patient Restful APIs](http://52.117.130.141:30551/api/user/9999511481) |
| Patient App                | [Mobile App - Patient](https://github.com/hackaltran/Altran-CFC-Covid-19/tree/master/CFC_UI/apk) |
| Monitoring Backend Service | [Monitoring Restful APIs](http://52.117.130.139:31562/doctors) |
| Moniroting Dashboard       | [Monitoring Dashboard](http://52.117.130.142:32639/login) |

#### Default Credentials
To use solution and existing deployed infrastructure, you can register yourself as a new patient or you can use the default credentials saved in our cloudant database placed at respective paths-

###### Patient (to be used for accessing Patient Mobile App) - [PATH](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_UI/apk/patient_app_credentials.txt)

###### Doctor (to be used for accessing Monitoring Dashboard) - [PATH](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_MonitoringUI/public/monitor_dasboard_credentials.txt)

###### Medical Assistant (to be used for accessing Monitoring Dashboard) - [PATH](https://github.com/hackaltran/Altran-CFC-Covid-19/blob/master/CFC_MonitoringUI/public/monitor_dasboard_credentials.txt)

## Deployment Model

![Deployment](tech-docs/deployment.png)


## Configuration

![Configuration](tech-docs/configuration.png)

## Privacy Policy

Privacy Policy
Altran Inc built the Are You Well app as a Free app. This SERVICE is provided by Altran Inc at no cost and is intended for use as is.

This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.

If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.

The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Are You Well unless otherwise defined in this Privacy Policy.

Information Collection and Use

For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Gallery, Camera, Contact List, . The information that we request will be retained by us and used as described in this privacy policy.

The app does use third party services that may collect information used to identify you.

Link to privacy policy of third party service providers used by the app

Google Play Services
Log Data

We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.

Cookies

Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.

This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.

Service Providers

We may employ third-party companies and individuals due to the following reasons:

To facilitate our Service;
To provide the Service on our behalf;
To perform Service-related services; or
To assist us in analyzing how our Service is used.
We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.

Security

We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.

Links to Other Sites

This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

Children’s Privacy

These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.

Changes to This Privacy Policy

We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.

This policy is effective as of 2020-07-30

Contact Us

If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at areyouwell@aricent.com.


## Built with

* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [React Native](https://reactnative.dev/) - A framework for building native apps using React
* [IBM Cloudant](https://www.ibm.com/in-en/cloud/cloudant) - Cloudant is a non-relational, distributed database cloud-based service based on the Apache-backed CouchDB project and the open source BigCouch project.
* [IBM Watson](https://www.ibm.com/in-en/watson) - Watson is a question-answering computer system capable of answering questions posed in natural language, developed in IBM's DeepQA project.
* [IBM Push Notification](https://www.ibm.com/in-en/cloud/push-notifications) - Push Notifications service provides a unified push capability to send personalized and segmented real-time notifications to mobile and web applications.
* [docker](https://www.docker.com/) - Docker is a set of platform as a service products that uses OS-level virtualization to deliver software in packages called containers.
* [kubernetes](https://kubernetes.io/) - Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications.


## Versioning
v1.0.0.0

## Authors

- Deepak Goyal
- Hitesh Choudhary
- Manoj Gupta
- Chandresh Tiwari
- Yogesh Kumar

## License

Proprietary. The code is submitted on a “as is” basis for the sole purpose of “Call for code 2020 COVID-19” challenge participation

## Acknowledgments

* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [React Native](https://reactnative.dev/) - A framework for building native apps using React
* [IBM Cloudant](https://www.ibm.com/in-en/cloud/cloudant) - Cloudant is a non-relational, distributed database cloud-based service based on the Apache-backed CouchDB project and the open source BigCouch project.
* [IBM Watson](https://www.ibm.com/in-en/watson) - Watson is a question-answering computer system capable of answering questions posed in natural language, developed in IBM's DeepQA project.
* [IBM Push Notification](https://www.ibm.com/in-en/cloud/push-notifications) - Push Notifications service provides a unified push capability to send personalized and segmented real-time notifications to mobile and web applications.
* [docker](https://www.docker.com/) - Docker is a set of platform as a service products that uses OS-level virtualization to deliver software in packages called containers.
* [kubernetes](https://kubernetes.io/) - Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications.
 * [Carbon Design System - IBM](https://www.carbondesignsystem.com/) - Design Language used for whole project
