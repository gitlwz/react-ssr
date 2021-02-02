import { useMemo, memo } from "react"
import MarkdownIt from "markdown-it"
import "github-markdown-css"
const md = new MarkdownIt({
    html: true,
    linkify: true
})

const b64_to_utf8 = (str) => {
    str = (typeof str === "string") ? str : ""
    return decodeURIComponent(escape(atob(str)))
}
export default memo(({ content, isBase64 }) => {
    const html = useMemo(() => {
        const markDownContent = isBase64 ? b64_to_utf8(content) : content
        const html = md.render(markDownContent)
        return html
    }, [content, isBase64])
    return <div className="markdown-body">
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
})