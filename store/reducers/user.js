import axios from "axios"
const LOGOUT = "LOGOUT"
export function logout() {

    return dispatch => {
        axios.post("/logout")
            .then((resp) => {
                if (resp.status === 200) {
                    dispatch({
                        type: LOGOUT
                    })
                } else {
                    console.log("登出失败", resp)
                }
            }).catch((error) => {
                console.log("登出失败", error)
            })
    }
}

const initialState = {}
export default function (state = initialState, action) {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state
    }
}