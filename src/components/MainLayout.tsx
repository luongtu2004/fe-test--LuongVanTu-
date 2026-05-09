import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Switch, theme, ConfigProvider, Drawer } from 'antd';
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
import { Grid } from 'antd';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

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

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className={`h-14 flex items-center border-b border-border ${collapsed && !isMobile ? 'justify-center' : 'justify-between px-4'}`}>
        {(!collapsed || isMobile) ? (
          <>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                T
              </div>
              <span className="font-semibold text-foreground truncate">TaskBoard</span>
            </div>
            {!isMobile && (
              <Button
                type="text"
                size="small"
                icon={<MenuFoldOutlined />}
                onClick={() => setCollapsed(true)}
                className="text-muted-foreground hover:text-foreground"
              />
            )}
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
          onClick={handleMenuClick}
        />
      </div>
    </>
  );

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
        {!isMobile ? (
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            className="border-r border-border z-10 !bg-background"
            width={240}
          >
            <SidebarContent />
          </Sider>
        ) : (
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            bodyStyle={{ padding: 0 }}
            width={240}
            className="!bg-background"
          >
            <SidebarContent />
          </Drawer>
        )}

        <Layout className="bg-background">
          <Header className="h-14 flex justify-between items-center px-4 md:px-6 border-b border-border bg-background sticky top-0 z-20">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-foreground mr-4"
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={isDarkMode}
                onChange={(checked) => setIsDarkMode(checked)}
                checkedChildren={<MoonOutlined className="text-xs" />}
                unCheckedChildren={<SunOutlined className="text-xs" />}
                className={isDarkMode ? 'bg-primary' : 'bg-muted'}
              />
            </div>
          </Header>
          <Content className="p-4 md:p-8 overflow-auto">
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
