FROM node:20 as development

WORKDIR /app

COPY package*.json ./

RUN npm run

COPY . .

# RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start:dev" ]

FROM node:20 as production

WORKDIR /app

COPY package*.json ./

RUN npm run

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]