import { useState, useCallback } from "react"
import { Select, Spin } from "antd"
import debounce from "lodash/debounce"

const api = require("../../lib/api")
const Option = Select.Option

const SearChUser = () => {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])

    const fetchUser = useCallback(debounce((value) => {
        console.log(value)
        setFetching(true)
        setOptions([])

        api.request({
            url: `/search/users?q=${value}`
        })
            .then((resp) => {
                const data = resp.data.items.map((user) => ({
                    text: user.login,
                    value: user.login
                }))
                setFetching(false)
                setOptions(data)
            })

    }, 500))
    return <Select
        showSearch
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        placeholder="创建者"
        onSearch={fetchUser}
        allowClear={true}
        style={{ width: 200 }}
    >
        {
            options.map((op) => {
                return <Option value={op.value} key={op.value}>{op.text}</Option>
            })
        }
    </Select>
}

export default SearChUser;