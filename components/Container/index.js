
const style = {
    width: "100%",
    maxWidth: 1200,
    marginLeft: "auto",
    marginRight: "auto"
}
export default ({ children }) => {
    return <div style={style}>{children}</div>
}