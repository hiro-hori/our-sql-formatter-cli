FROM node:lts

RUN npm install -g sql-formatter-plus

ADD main.js /

ENTRYPOINT ["node", "main.js"]
