import { withRouter } from "next/router"
import Link from "next/link"
import Head from 'next/head'
import dynamic from "next/dynamic"

// import moment from "moment";

const Comp = dynamic(import("../components/comp"))

const color = "#333333"

const A = ({ router, name, time }) => {
    return <div>
        <Head>
            <title>{time}</title>
        </Head>
        <Link href="#aaa">
            <a>a page {router.query.id}{name}</a>
        </Link>
        <Comp />

        {/* <style jsx>
            {`
                a{
                    color:${color};
                }
            `}
        </style>
        <style jsx global>
            {`
                a{
                    color:red
                }
            `}
        </style> */}
    </div>
}

A.getInitialProps = async () => {
    const moment = await import("moment")
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "liu",
                time: moment.default(Date.now() - 60 * 1000).fromNow()
            })
        }, 1000)
    })
    return await promise
}
export default withRouter(A)