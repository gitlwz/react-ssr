import { createStore, combineReducers, applyMiddleware } from "redux"
import ReduxThunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import reducers from "./reducers"

export default function initializeStore(state = {}) {
    const allReduce = combineReducers(reducers)
    const store = createStore(
        allReduce,
        Object.assign({}, state),
        composeWithDevTools(applyMiddleware(ReduxThunk))
    )
    return store
}