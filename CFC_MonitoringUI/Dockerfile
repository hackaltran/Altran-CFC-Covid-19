FROM ubuntu:18.04
USER root

WORKDIR /home/app

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
RUN npm install -g serve

RUN npm -v
RUN nodejs -v

RUN mkdir /home/app/build
COPY build /home/app/build/
RUN ls -l /home/app
RUN ls -l /home/app/build

CMD serve -s build -l 8080
