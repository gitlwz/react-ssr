const GITHUB_OAUTN_URL = "https://github.com/login/oauth/authorize"
const SCOPE = "user"
const client_id = "240693fa757b07fd8c81"
const client_secret = "5c72d86ca9075424397407e32727520fea5f9c9a"
module.exports = {
    GITHUB_OAUTN_URL,
    OAUTH_URL: `${GITHUB_OAUTN_URL}?client_id=${client_id}&scope=${SCOPE}`,
    github: {
        request_token_url: "https://github.com/login/oauth/access_token",
        client_id,
        client_secret
    }
}
