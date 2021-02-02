
import WithRepoBasic from "../../components/with-repo-basic"
const detail = ({ name }) => {
    return <span>
        detail index{name}
    </span>
}

detail.getInitialProps = async () => {
    return {
        name: 123
    }
}

export default WithRepoBasic(detail, "index");