import App, { Container } from "next/app"
import { Provider } from "react-redux"
import withRedux from "../lib/with-redux"
import Layout from "../components/Layout"
import PageLoading from "../components/PageLoading"
import Router from "next/router"
import Link from "next/link"
import "antd/dist/antd.css"

class MyApp extends App {
    state = {
        loading: false
    }
    statrtLoading = () => {
        this.setState({ loading: true })
    }
    stopLoading = () => {
        this.setState({ loading: false })
    }
    componentDidMount() {
        Router.events.on("routeChangeStart", this.statrtLoading)
        Router.events.on("routeChangeComplete", this.stopLoading)
        Router.events.on("routeChangeError", this.stopLoading)
    }
    componentWillUnMount() {
        Router.events.off("routeChangeStart")
        Router.events.off("routeChangeComplete")
        Router.events.off("routeChangeError")
    }
    static async getInitialProps(ctx) {
        let pageProps
        const { Component } = ctx
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }
    render() {
        const { loading } = this.state
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Container >
                <Provider store={reduxStore}>
                    {loading && <PageLoading />}
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container >
        )
    }
}

export default withRedux(MyApp);