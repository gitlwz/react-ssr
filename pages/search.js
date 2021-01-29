import { withRouter } from "next/router"

const search = ({ router }) => {
    return <span>search{router.query.query}</span>
}

export default withRouter(search);