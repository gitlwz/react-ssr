const GITHUB_OAUTN_URL = "https://github.com/login/oauth/authorize"
const SCOPE = "user"
const client_id = ""
const client_secret = ""
module.exports = {
    GITHUB_OAUTN_URL,
    OAUTH_URL: `${GITHUB_OAUTN_URL}?client_id=${client_id}&scope=${SCOPE}`,
    github: {
        request_token_url: "https://github.com/login/oauth/access_token",
        client_id,
        client_secret
    }
}
