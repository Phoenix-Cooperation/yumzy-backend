import { Redis } from "ioredis"
import { DataSource } from "apollo-datasource"
import console from 'consola';
import genericPool from 'generic-pool'
// import content from "../graphql/resolvers/content";

const { error } = console;
// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
// })
export const factory = {
    create: () => {
        console.log("redis is creating")
        return new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
        })
    },
    destroy: (client) => {
        console.log("redis conn is deleting")
        client.quit();
    }
}


export class RedisCache extends DataSource {
    constructor(factory) {
        super()
        // if (this.redis === undefined) {
        //     this.redis = new Redis({
        //         host: process.env.REDIS_HOST,
                // port: process.env.REDIS_PORT,
                // username: process.env.REDIS_USERNAME,
                // password: process.env.REDIS_PASSWORD,
        //         idleTimeout: 10000
        //     })
        // }
        
        this.pool = genericPool.createPool(factory, {
            max: 8,
            min: 1,
            acquireTimeoutMillis: 10000,
            idleTimeoutMillis: 500
        })
    }

    initialize(config) {
        this.context = config.context
    }

    async checkCache(key) {
        let redis;
        try {
            redis = await this.pool.acquire()
            const res = await redis.exists(key)
            if (res === 1) {
                return true
            } else {
                return false
            }

        } catch (error) {
            error({ message: error.message, badge: true })
            return false
        } finally {
            if (redis) {
                await this.pool.release(client)
            }
        }
    }

    async getSingleContent(contentId) {
        let redis;
        try {
            redis = await this.pool.acquire()
            const tempContent = await redis.get(contentId)
            return JSON.parse(tempContent)
        } catch (error) {
            error({ badge: true, message: err.message })
            throw new Error(err.message)
        } finally {
            if (redis) {
                await this.pool.release(redis)
            }
        }
    }

    async getContentFromCache(contentDetails) {
        let notInCache = []
        let content = []
        let redis
        try {
            redis = await this.pool.acquire()
            for (const contentDetail of contentDetails) {
                const tempContent = await redis.get(contentDetail?.contentId)
                if (tempContent) content.push(JSON.parse(tempContent))
                else notInCache.push(contentDetail)
            }
            
            return { content, notInCache }
        } catch (err) {
            error({ badge: true, message: err.message })
            throw new Error(err.message)
        } finally {
            if (redis) {
                await this.pool.release(redis)
            }
        }
    }

    async setContentToCache(content) {
        const { id: key } = content
        let redis;
        try {
            redis = await this.pool.acquire()
            await redis.set(key, JSON.stringify(content), 'EX', '300')
        } catch (err) {
            error({ message: err.message, badge: true })
            throw new Error(err.message)
        } finally {
            if (redis) {
                await this.pool.release(redis)
            }
        }
    }

    async deleteSingleContentFromCache(id) {
        let redis;
        try {
            redis = await this.pool.acquire()
            await redis.del(id)
        } catch (err) {
            error({ message: err.message, badge: true })
            throw new Error(`delete from cache error: ${err.message}`)
        } finally {
            if (redis) {
                await this.pool.release(redis)
            }
        }
    }
}

