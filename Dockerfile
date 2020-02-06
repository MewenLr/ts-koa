FROM node:12-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3030
CMD [ "npm", "run", "prod" ]
