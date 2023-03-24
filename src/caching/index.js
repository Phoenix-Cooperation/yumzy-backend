import { Redis } from "ioredis"
import { DataSource } from "apollo-datasource"
import console from 'consola';

const { error } = console;
// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
// })

class RedisCache extends DataSource {
    constructor() {
        super()
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
        })
    }

    initialize(config) {
        this.context = config.context
    }

    async checkCache(key) {
        try {
            const res = await this.redis.exists(key)
            console.log(res)
            if (res === 1) {
                return true
            } else {
                return false
            }

        } catch (error) {
            error({ message: error.message, badge: true })
            return false
        }
    }

    
    generateKeyUserContent(userId, pageSize, after) {
        return `${userId}-${after}-${pageSize + after}`
    }

    async setContentCache(userId, pageSize, after, response) {
        const key = this.generateKeyUserContent(userId, pageSize, after)

        try {
            await this.redis.set(key, JSON.stringify(response), 'EX', '60')
        } catch (err) {
            error({ message: err.message, badge: true })
            return 
        }
    }

    async getContentCache(userId, pageSize, after) {
        const key = this.generateKeyUserContent(userId, pageSize, after)
        console.log('get content')
        try {
            if (this.checkCache(key)) {
                const res = await this.redis.get(key)
                return JSON.parse(res)
            }
            return null
        } catch (err) {
            error({ message: err.message, badge: true })
            return null
        }
    }
}

export default RedisCache;