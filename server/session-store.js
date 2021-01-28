
function getRedisSessionId(id) {
    return `ssid:${id}`
}

class RedissSessionStore {
    constructor(client) {
        this.client = client
    }
    //获取redis中存储的session数据
    async get(sid) {
        console.log("get session", sid)
        const id = getRedisSessionId(sid);
        const data = await this.client.get(id);
        if (!data) {
            return null;
        } else {
            try {
                return JSON.parse(data)
            } catch (error) {
                console.log(error)
            }
        }
    }
    //存储session数据到redis中
    async set(sid, sess, ttl) {
        console.log("set session", sid)
        const id = getRedisSessionId(sid);
        if (typeof ttl === "number") {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(sess)
            if (ttl) {
                await this.client.setex(id, ttl, sessStr)
            } else {
                await this.client.set(id, sessStr)
            }
        } catch (error) {
            console.log(error)
        }
    }
    //从reids当中删除某个session
    async destroy(sid) {
        console.log("destroy session", sid)
        const id = getRedisSessionId(sid)
        await this.client.del(id)
    }
}

module.exports = RedissSessionStore;