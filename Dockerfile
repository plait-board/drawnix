
FROM node:16

WORKDIR /app
COPY . /app

RUN npm install

EXPOSE 7200

CMD ["npm", "run", "start"]
