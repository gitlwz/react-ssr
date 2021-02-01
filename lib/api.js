const axios = require("axios")
const isServer = typeof window === "undefined"

const github_base_url = "https://api.github.com"

async function requestGithub(method, url, data, headers = {}) {
    console.log(`start==${github_base_url}${url}`, Date.now())
    const result = await axios({
        method,
        url: `${github_base_url}${url}`,
        data,
        headers: {
            ...headers,
            Accept: "application/json"
        }
    })
    try {
        result.data = JSON.parse(result.data)
    } catch (error) {

    }
    console.log(`end==${github_base_url}${url}`, Date.now())
    return result
}

async function request({ method = "GET", url, data = {} }, req, res) {
    if (!url) {
        throw Error("url不存在")
    }
    if (isServer) {
        const session = req.session
        const githubAuth = session && session.githubAuth || {}
        const headers = {
            Accept: "application/json"
        }
        if (githubAuth.access_token) {
            headers["Authorization"] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return await requestGithub(method, url, data, headers)
    } else {
        const result = await axios({
            method,
            url: `/github${url}`,
            data,
            headers: {
                Accept: "application/json"
            }
        })
        if (typeof result.data === "string") {
            try {
                result.data = JSON.parse(result.data)
            } catch (error) {

            }

        }
        return result
    }
}

module.exports = { request, requestGithub }