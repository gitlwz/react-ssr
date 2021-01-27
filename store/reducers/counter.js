
const initialState = {
    count: 0
}
const ADD = "ADD"
export default function (state = initialState, action) {
    switch (action.type) {
        case ADD:
            return {
                count: state.count + 1
            }
        default:
            return state
    }
}