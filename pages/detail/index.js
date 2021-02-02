import dynamic from "next/dynamic"
import WithRepoBasic from "../../components/with-repo-basic"
const api = require("../../lib/api")
const MdRender = dynamic(
    () => import("../../components/markdownRender"),
    {
        loading: () => <p>loading</p>
    }
)
const detail = ({ readme }) => {
    return <MdRender
        content={readme.content}
        isBase64={true}
    />
}

detail.getInitialProps = async ({ ctx }) => {
    const { owner, name } = ctx.query
    const readmeResp = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, ctx.req, ctx.res)
    return {
        readme: readmeResp.data
    }
}

export default WithRepoBasic(detail, "index");