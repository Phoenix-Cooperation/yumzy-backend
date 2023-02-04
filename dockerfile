FROM node:16-alpine3.17

ENV RDS_DATABASE_HOST=yumzy-db-2.covnrcnklflr.us-east-1.rds.amazonaws.com
ENV RDS_DATABASE_USER=postgres
ENV RDS_DATABASE_PASSWORD=postgresyumzy4321
ENV RDS_DATABASE_DB=yumzy
ENV PORT=5000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]