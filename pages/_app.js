import App, { Container } from "next/app"
import { Provider } from "react-redux"
import withRedux from "../lib/with-redux"
import "antd/dist/antd.css"

class MyApp extends App {
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
        const { Component, pageProps, reduxStore } = this.props
        console.log(this.props)
        return (
            <Container >
                <Provider store={reduxStore}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        )
    }
}

export default withRedux(MyApp);