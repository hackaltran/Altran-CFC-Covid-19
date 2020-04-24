
FROM ubuntu:latest
USER root

WORKDIR /home/app
COPY ./package.json /home/app/package.json

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
RUN npm install

RUN npm -v
RUN nodejs -v

COPY . /home/app
RUN ls -l /home/app

EXPOSE 3000

CMD npm run start
