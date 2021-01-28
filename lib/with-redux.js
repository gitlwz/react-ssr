import createStore from "../store/store"
import React from "react"
const isServer = typeof window === "undefined"
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__"

function getOrCreateStore(initialState) {
    if (isServer) {
        return createStore(initialState)
    }
    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}
export default Comp => {
    class WithReduxApp extends React.Component {
        static getInitialProps = async (ctx) => {
            let reduxStore;
            if (isServer) {
                const { req } = ctx.ctx
                const session = req.session
                let initialState;
                if (session && session.userInfo) {
                    initialState = { user: session.userInfo }
                }
                reduxStore = getOrCreateStore(initialState)
            } else {
                reduxStore = getOrCreateStore()
            }
            ctx.reduxStore = reduxStore;
            let appProps = {}
            if (typeof Comp.getInitialProps === "function") {
                appProps = await Comp.getInitialProps(ctx)
            }
            return {
                ...appProps,
                initialReduxState: reduxStore.getState()
            }
        }
        constructor(props) {
            super(props)
            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }
        render() {
            return <Comp {...this.props} reduxStore={this.reduxStore}></Comp>
        }
    }
    return WithReduxApp
}