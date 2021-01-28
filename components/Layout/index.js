import { useState, useCallback } from "react"
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd"
import Container from "../Container"
import getConfig from "next/config"
import { connect } from "react-redux"
import { logout } from "../../store/reducers/user"

const { publicRuntimeConfig } = getConfig()
const { Header, Content, Footer } = Layout

const githubIconStyle = {
    color: "white",
    fontSize: 40,
    display: "block",
    paddingTop: 10,
    marginRight: 20
}
const footerSryle = {
    textAlign: "center"
}
const MyLayout = ({ children, user, logout }) => {
    const [search, setSearch] = useState("")
    const handleSearchChange = useCallback((evnet) => {
        setSearch(evnet.target.value)
    }, [])
    const handleOnSearch = useCallback(() => {

    })
    const handleLogout = useCallback((e) => {
        if (e.key === "logout") {
            logout()
        }
    }, [])

    const userDropDown = (
        <Menu onClick={handleLogout}>
            <Menu.Item key="logout">
                <a href="javascript:void(0)">
                    登出
                </a>
            </Menu.Item>
        </Menu>
    )
    return (<Layout>
        <Header >
            <div className="header-inner">
                <div className="header-left">
                    <div className="logo">
                        <Icon type="github" style={githubIconStyle}></Icon>
                    </div>
                    <div>
                        <Input.Search
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="搜索仓库"
                            onSearch={handleOnSearch}
                        />
                    </div>
                </div>
                <div className="header-right">
                    <div className="user">
                        {
                            user && user.id ? (
                                <a href="/">
                                    <Dropdown overlay={userDropDown}>
                                        <Avatar size={40} src={user.avatar_url}></Avatar>
                                    </Dropdown>
                                </a>
                            ) : (

                                    <a href={publicRuntimeConfig.OAUTH_URL}>
                                        <Tooltip title="点击进行登陆">
                                            <Avatar size={40} icon="user"></Avatar>
                                        </Tooltip>
                                    </a>
                                )
                        }

                    </div>
                </div>
            </div>
        </Header>
        <Content>
            <Container>
                {children}
            </Container>
        </Content>
        <Footer style={footerSryle}>
            develp by liuwenzhu
        </Footer>
        <style jsx>
            {`
            .header-inner{
                padding-left:20px;
                padding-right:20px;
                display:flex;
                justify-content:space-between;
            }
            .header-left{
                display:flex;
                justify-content:flex-start;
            }
        `}
        </style>
        <style jsx global>{`
            #__next{
                height:100%;
            }
            .ant-layout{
                height:100%;
            }
            .ant-layout-header{
                padding-left:0;
                padding-right:0;
            }
        `}
        </style>
    </Layout >)
}
export default connect(function mapStateToProps(state) {
    return { user: state.user }
}, function mapReducer(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
})(MyLayout)