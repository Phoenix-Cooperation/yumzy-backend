const dbConfig = {
    HOST: process.env.RDS_DATABASE_HOST,
    USER: process.env.RDS_DATABASE_USER,
    PASSWORD: process.env.RDS_DATABASE_PASSWORD,
    DB: process.env.RDS_DATABASE_DB,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default dbConfig;