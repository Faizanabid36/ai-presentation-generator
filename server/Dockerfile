FROM node:16

ENV NODE_ENV development

WORKDIR /server-docker

COPY . .

RUN npm install
RUN npm run dev

EXPOSE 8000
