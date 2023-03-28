import { Redis } from "ioredis"
import { DataSource } from "apollo-datasource"
import console from 'consola';
// import content from "../graphql/resolvers/content";

const { error } = console;
// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
// })

class RedisCache extends DataSource {
    redis;
    constructor() {
        super()
        if (this.redis === undefined) {
            this.redis = new Redis({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD,
                idleTimeout: 10000
            })
        }
    }

    initialize(config) {
        this.context = config.context
    }

    async checkCache(key) {
        try {
            const res = await this.redis.exists(key)
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

    async getSingleContent(contentId) {
        try {
            const tempContent = await this.redis.get(contentId)
            return JSON.parse(tempContent)
        } catch (error) {
            error({ badge: true, message: err.message })
            throw new Error(err.message)
        }
    }

    async getContentFromCache(contentDetails) {
        let notInCache = []
        let content = []
        try {
            for (const contentDetail of contentDetails) {
                const tempContent = await this.redis.get(contentDetail?.contentId)
                if (tempContent) content.push(JSON.parse(tempContent))
                else notInCache.push(contentDetail)
            }
            
            return { content, notInCache }
        } catch (err) {
            error({ badge: true, message: err.message })
            throw new Error(err.message)
        }
    }

    async setContentToCache(content) {
        const { id: key } = content
        try {
            await this.redis.set(key, JSON.stringify(content), 'EX', '300')
        } catch (err) {
            error({ message: err.message, badge: true })
            throw new Error(err.message)
        }
    }

    // async setContentCache(userId, pageSize, after, response) {
    //     const key = this.generateKeyUserContent(userId, pageSize, after)

    //     try {
    //         await this.redis.set(key, JSON.stringify(response), 'EX', '60')
    //     } catch (err) {
    //         error({ message: err.message, badge: true })
    //         return 
    //     }
    // }

    // async getContentCache(userId, pageSize, after) {
    //     const key = this.generateKeyUserContent(userId, pageSize, after)
    //     console.log('get content')
    //     try {
    //         if (this.checkCache(key)) {
    //             const res = await this.redis.get(key)
    //             return JSON.parse(res)
    //         }
    //         return null
    //     } catch (err) {
    //         error({ message: err.message, badge: true })
    //         return null
    //     }
    // }
}

export default RedisCache;