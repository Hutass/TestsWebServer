import React, { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  CheckSquareOutlined,
  UserAddOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Modal } from "antd";

const { Header, Footer, Sider, Content } = Layout;

/**
 * Компонент, отвечающий за область навигации
 * @param {useStates} user геттер и сеттер для передачи аутентифицированнного пользователя
 * @returns
 */
const App = ({ user, setUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  /**
   * Выход из учетной записи, передача запроса о выходе на сервер
   * @param {modalEvent} event передача события из модального окна
   * @returns
   */
  const logOff = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
    };
    return await fetch("api/account/logoff", requestOptions).then(
      (response) => {
        response.status === 200 &&
          setUser({ isAuthenticated: false, userName: "" });
        handleOk();
        response.status === 401 && navigate("/login");
      }
    );
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Are you sure you want to log out of your account?"
  );

  const showModal = () => {
    setOpen(true);
  };

  /**
   * Вызывается при подтверждении выхода из учетной записи
   */
  const handleOk = () => {
    setModalText("You successfully log out");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    navigate("/login");
  };

  /**
   * Вызывается при закрытии модального окна без подтверждения
   */
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        {user.isAuthenticated ? (
          user.userRole == "admin" || user.userRole == "moderator" ? (
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <FormOutlined />,
                  label: <Link to="/">Main</Link>,
                },
                {
                  key: "2",
                  icon: <CheckSquareOutlined />,
                  label: <Link to="/testsView">Tests</Link>,
                },
                {
                  key: "3",
                  icon: <CheckSquareOutlined />,
                  label: <Link to="/tests">Tests edit</Link>,
                },
                {
                  key: "4",
                  icon: <CheckSquareOutlined />,
                  label: <Link to="/questions">Questions edit</Link>,
                },
                {
                  key: "5",
                  icon: <CheckSquareOutlined />,
                  label: <Link to="/questionTypes">Question Types edit</Link>,
                },
                {
                  key: "6",
                  icon: <LogoutOutlined />,
                  label: <Link onClick={showModal}>Exit</Link>,
                },
              ]}
            />
          ) : (
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <FormOutlined />,
                  label: <Link to="/">Main</Link>,
                },
                {
                  key: "2",
                  icon: <CheckSquareOutlined />,
                  label: <Link to="/testsView">Tests</Link>,
                },
                {
                  key: "3",
                  icon: <LogoutOutlined />,
                  label: <Link onClick={showModal}>Exit</Link>,
                },
              ]}
            />
          )
        ) : (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <FormOutlined />,
                label: <Link to="/">Main</Link>,
              },
              {
                key: "2",
                icon: <CheckSquareOutlined />,
                label: <Link to="/testsView">Tests</Link>,
              },
              {
                key: "3",
                icon: <UserAddOutlined />,
                label: <Link to="/register">Register</Link>,
              },
              {
                key: "4",
                icon: <LoginOutlined />,
                label: <Link to="/login">Log In</Link>,
              },
            ]}
          />
        )}
      </Sider>
      <Modal
        title="Title"
        open={open}
        onOk={logOff}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <Layout className="site-layout">
        <Header
          style={{
            top: 0,
            zIndex: 1,
            width: "100%",
            background: colorBgContainer,
            display: "flex",
          }}
        >
          <div style={{ height: 60 }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            {user.isAuthenticated ? (
              <>
                <label>
                  User: {user.userName}, {user.userRole}
                </label>
              </>
            ) : (
              <label>User: Guest</label>
            )}
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 800,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>Test program 2023</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
