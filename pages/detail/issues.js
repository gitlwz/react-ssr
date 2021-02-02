
import WithRepoBasic from "../../components/with-repo-basic"
const Issues = ({ name }) => {
    return <span>
        issues index{name}
    </span>
}

Issues.getInitialProps = async () => {

    return {
        name: 123
    }
}

export default WithRepoBasic(Issues,"issues");