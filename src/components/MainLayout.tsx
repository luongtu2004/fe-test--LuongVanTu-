import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Switch, theme, ConfigProvider } from 'antd';
import { 
  DashboardOutlined, 
  UnorderedListOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Overview',
    },
    {
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: 'Issues',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#ffffff' : '#000000',
          colorBgContainer: 'transparent',
          colorBorder: isDarkMode ? '#262626' : '#e5e5e5',
        }
      }}
    >
      <Layout className="min-h-screen bg-background">
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          className="border-r border-border z-10 !bg-background"
          width={240}
        >
          <div className={`h-14 flex items-center border-b border-border ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                    T
                  </div>
                  <span className="font-semibold text-foreground truncate">TaskBoard</span>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<MenuFoldOutlined />}
                  onClick={() => setCollapsed(true)}
                  className="text-muted-foreground hover:text-foreground"
                />
              </>
            ) : (
              <div 
                className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => setCollapsed(false)}
                title="Expand sidebar"
              >
                T
              </div>
            )}
          </div>
          <div className="p-3">
            <Menu
              mode="inline"
              className="border-none bg-transparent !text-muted-foreground font-medium"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
            />
          </div>
        </Sider>
        <Layout className="bg-background">
          <Header className="h-14 flex justify-end items-center px-6 border-b border-border bg-background sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <Switch
                checked={isDarkMode}
                onChange={(checked) => setIsDarkMode(checked)}
                checkedChildren={<MoonOutlined className="text-xs" />}
                unCheckedChildren={<SunOutlined className="text-xs" />}
                className={isDarkMode ? 'bg-primary' : 'bg-muted'}
              />
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </Header>
          <Content className="p-8 overflow-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
