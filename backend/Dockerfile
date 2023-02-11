FROM  --platform=linux/amd64 node:18.13-alpine 
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY dist .
COPY uploads-sample ./uploads-sample
COPY sampledata.xlsx .
EXPOSE 8100
CMD yarn knex migrate:latest &&\
    yarn knex seed:run &&\
    node server.js

