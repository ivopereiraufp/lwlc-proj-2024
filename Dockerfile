FROM node:14

WORKDIR /lwlc-proj-2024
COPY package.json .
RUN npm install
COPY . .
CMD npm start