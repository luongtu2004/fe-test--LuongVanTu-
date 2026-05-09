import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Row, Col, Progress, List, Typography } from 'antd';
import { 
  CheckCircle2, 
  CircleDashed, 
  ListTodo, 
  Activity
} from 'lucide-react';
import { selectTaskStats, selectAllTasks } from '../tasksSlice';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const stats = useSelector(selectTaskStats);
  const allTasks = useSelector(selectAllTasks);
  
  const recentTasks = [...allTasks]
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
    .slice(0, 5);

  const donePercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const inProgressPercent = stats.total > 0 ? Math.round((stats.in_progress / stats.total) * 100) : 0;
  const todoPercent = stats.total > 0 ? Math.round((stats.todo / stats.total) * 100) : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="space-y-6 w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <Title level={2} className="!m-0 tracking-tight !font-semibold">Overview</Title>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={item}>
            <Card bordered={false} className="hover:-translate-y-0.5 transition-transform">
              <Statistic
                title={<span className="text-muted-foreground font-medium flex items-center gap-2"><ListTodo size={16} /> Total Issues</span>}
                value={stats.total}
                valueStyle={{ fontSize: '2rem', fontWeight: '600' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={item}>
            <Card bordered={false} className="hover:-translate-y-0.5 transition-transform">
              <Statistic
                title={<span className="text-muted-foreground font-medium flex items-center gap-2"><CircleDashed size={16} /> To Do</span>}
                value={stats.todo}
                valueStyle={{ fontSize: '2rem', fontWeight: '600' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={item}>
            <Card bordered={false} className="hover:-translate-y-0.5 transition-transform">
              <Statistic
                title={<span className="text-muted-foreground font-medium flex items-center gap-2"><Activity size={16} /> In Progress</span>}
                value={stats.in_progress}
                valueStyle={{ fontSize: '2rem', fontWeight: '600' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={item}>
            <Card bordered={false} className="hover:-translate-y-0.5 transition-transform">
              <Statistic
                title={<span className="text-muted-foreground font-medium flex items-center gap-2"><CheckCircle2 size={16} /> Done</span>}
                value={stats.done}
                valueStyle={{ fontSize: '2rem', fontWeight: '600' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <motion.div variants={item} className="h-full">
            <Card title="Status Ratio" bordered={false} className="h-full">
              <div className="flex flex-col space-y-6 py-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><CheckCircle2 size={16} /> Done</span>
                    <span className="font-semibold">{donePercent}%</span>
                  </div>
                  <Progress percent={donePercent} status="success" showInfo={false} strokeWidth={8} strokeLinecap="square" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Activity size={16} /> In Progress</span>
                    <span className="font-semibold">{inProgressPercent}%</span>
                  </div>
                  <Progress percent={inProgressPercent} status="active" showInfo={false} strokeWidth={8} strokeLinecap="square" strokeColor="#3b82f6" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><CircleDashed size={16} /> Todo</span>
                    <span className="font-semibold">{todoPercent}%</span>
                  </div>
                  <Progress percent={todoPercent} trailColor="hsl(var(--muted))" strokeColor="hsl(var(--muted-foreground))" showInfo={false} strokeWidth={8} strokeLinecap="square" />
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={14}>
          <motion.div variants={item} className="h-full">
            <Card title="Recent Activity" bordered={false} className="h-full">
              <List
                itemLayout="horizontal"
                dataSource={recentTasks}
                className="-mt-2"
                renderItem={(task) => (
                  <List.Item className="group hover:bg-muted/50 rounded-lg px-4 -mx-4 transition-colors !border-b-0 cursor-pointer">
                    <List.Item.Meta
                      avatar={
                        <div className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full border border-border text-xs ${
                          task.status === 'done' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {task.status === 'done' ? <CheckCircle2 size={12} /> : 
                           task.status === 'in_progress' ? <Activity size={12} /> : 
                           <CircleDashed size={12} />}
                        </div>
                      }
                      title={<span className="font-medium text-foreground">{task.title}</span>}
                      description={
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className={`px-2 py-0.5 rounded-sm border font-medium ${
                            task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                            'bg-green-500/10 text-green-500 border-green-500/20'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            Created {dayjs(task.createdAt).format('MMM D')}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;
