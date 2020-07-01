FROM node:14
COPY main.js package.json package-lock.json /src/
WORKDIR /src
RUN npm install
ENTRYPOINT ["node", "/src/main.js"]
