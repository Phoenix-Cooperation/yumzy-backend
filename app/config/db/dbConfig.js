const dbConfig = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "yumzy_foods",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default dbConfig;