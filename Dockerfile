FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN rm -rf public/ 
COPY package.json package-lock.json .
RUN npm install
COPY public/ .
EXPOSE 2000
CMD [ "npm", "start"]

#docker build . -t team-management
#docker run -it --name fr-service -p 3300:3300 food-recipe-service