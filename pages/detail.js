const detail = () => {
    return <span>详情页</span>
}
detail.getInitialProps = async () => {
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "liu",
            })
        }, 1000)
    })
    return await promise
}
export default detail;