
FROM node:16

WORKDIR /app

COPY . .

RUN rm -rf /tmp/package*.json && \
    rm -rf package*.json && \
    npm install

EXPOSE 7200

CMD ["npm", "run", "start"]
