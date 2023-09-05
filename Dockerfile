FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN chown root.root .
RUN npm install
COPY . .
EXPOSE 5050
CMD [ "npm", "start" ]