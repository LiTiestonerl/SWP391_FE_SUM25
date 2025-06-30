import React, { useState } from "react";
import {
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LineChartOutlined,
  StarOutlined,
  UserSwitchOutlined,
  TrophyOutlined,
  ProjectOutlined,
  ProfileOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}
const headerMenu = (
  <Menu>
    <Menu.Item key="home" icon={<HomeOutlined />}>
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item key="projects" icon={<AppstoreOutlined />}>
      <Link to="/projects">Projects</Link>
    </Menu.Item>
    <Menu.Item key="catalog" icon={<FolderOpenOutlined />}>
      <Link to="/catalog">Catalog</Link>
    </Menu.Item>
  </Menu>
);

const items = [
  getItem("Overview", "overview", <LineChartOutlined />),         // Tổng quan → biểu đồ tổng hợp
  getItem("ManageRating", "managerating", <StarOutlined />),      // Quản lý đánh giá → ngôi sao
  getItem("ManageUser", "user", <UserSwitchOutlined />),          // Quản lý người dùng → người dùng
  getItem("ManageCoaches", "managecoaches", <TeamOutlined />),    // Quản lý huấn luyện viên → nhóm người
  getItem("ManageRank", "managerank", <TrophyOutlined />),        // Quản lý xếp hạng → cúp
];
const Dashbroad = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              height: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 8,
            }}
          >
            <img
              src="/images/logo.jpg"
              alt="NoSmoking"
              style={{ height: 40, marginBottom: 4 }}
            />
            {!collapsed && (
              <span
                style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
              >
                NoSmoking
              </span>
            )}
          </div>
        </Link>

        {/* MENU */}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Dropdown overlay={headerMenu} trigger={["click"]}>
            <Button
              icon={<MenuOutlined />}
              type="text"
              style={{ color: "white" }}
            />
          </Dropdown>
          <span style={{ color: "white", marginLeft: 12, fontSize: 16 }}>
            Admin
          </span>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashbroad;
