FROM library/postgres

COPY /initdb/init_docker_postgres.sh /docker-entrypoint-initdb.d/
ADD  /initdb/init_docker_postgres.sh /docker-entrypoint-initdb.d/
COPY /initdb/init_docker_postgres.sh /

RUN chmod 0755 /docker-entrypoint-initdb.d/init_docker_postgres.sh
CMD ["docker-entrypoint.sh", "postgres"]
EXPOSE 5432
