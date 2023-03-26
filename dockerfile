FROM node:16-alpine3.17

ENV RDS_DATABASE_HOST=yumzy-db-2.covnrcnklflr.us-east-1.rds.amazonaws.com
ENV RDS_DATABASE_USER=postgres
ENV RDS_DATABASE_PASSWORD=postgresyumzy4321
ENV RDS_DATABASE_DB=yumzy
ENV PORT=5000
ENV REDIS_HOST=redis-12304.c10.us-east-1-2.ec2.cloud.redislabs.com
ENV REDIS_PORT=12304
ENV REDIS_USERNAME=default
ENV REDIS_PASSWORD=ahHtzSLGda01pORO3ImBzUOMnsNH1cxT

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]