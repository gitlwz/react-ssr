import { Button } from "antd"
import Link from "next/link"
import Router from "next/router"
import { connect } from "react-redux"

const events = [
    "routeChangeStart",
    "routeChangeComplete",
    "routeChangeError",
    "beforeHistoryChange",
    "hashChangeStart",
    "hashChangeComplete"
]

function makeEvent(type) {
    return (...args) => {
        console.log(type, ...args)
    }
}

events.forEach(event => {
    Router.events.on(event, makeEvent(event))
})

const Index = ({ count, dispatch }) => {
    function gotoB() {
        // Router.push({
        //     pathname: "/b",
        //     query: {
        //         id: 2
        //     }
        // }, "/b/2")
        dispatch({ type: "ADD" })
    }
    return <div>
        index
        <Link href="/a?id=1" as="/a/1">
            <Button >a page</Button>
        </Link>
        <Link href="/b?id=2" as="/b/2">
            <Button >b page</Button>
        </Link>
        <a>a 标签 {count}</a>
        <Button onClick={gotoB}>go b</Button>
    </div>
}
Index.getInitialProps = async (ctx) => {
    ctx.reduxStore.dispatch({
        type: "ADD"
    })
    return {
        a: 1
    }
}
export default connect(function mapStateToProps(state) {
    return {
        count: state.counter.count
    }
})(Index)