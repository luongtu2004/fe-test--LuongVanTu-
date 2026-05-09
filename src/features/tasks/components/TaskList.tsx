import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Form, 
  Popconfirm, 
  message,
  Typography,
  Card,
  Row,
  Col
} from 'antd';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  RotateCcw,
  CheckCircle2,
  CircleDashed,
  Activity,
  UserCircle2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectFilteredTasks, 
  deleteTask, 
  deleteManyTasks, 
  updateTaskStatus, 
  addTask, 
  updateTask,
  setFilter,
  resetFilters,
  setPage
} from '../tasksSlice';
import { Task } from '../../../types/task';
import { RootState } from '../../../store';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const TaskList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filteredTasks = useSelector(selectFilteredTasks);
  const { filters, pagination } = useSelector((state: RootState) => state.tasks);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const dateParam = searchParams.get('date');

    dispatch(setFilter({
      searchText: search,
      status: statusParam ? (statusParam.split(',') as Task['status'][]) : [],
      priority: priorityParam ? (priorityParam as Task['priority']) : null,
      dateRange: dateParam ? (dateParam.split(',') as [string, string]) : null,
    }));
  }, []);

  useEffect(() => {
    const params: any = {};
    if (filters.searchText) params.search = filters.searchText;
    if (filters.status.length) params.status = filters.status.join(',');
    if (filters.priority) params.priority = filters.priority;
    if (filters.dateRange) params.date = filters.dateRange.join(',');
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const [searchInput, setSearchInput] = useState(filters.searchText);

  useEffect(() => {
    setSearchInput(filters.searchText);
  }, [filters.searchText]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilter({ searchText: searchInput }));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleStatusFilter = (values: Task['status'][]) => {
    dispatch(setFilter({ status: values }));
  };

  const handlePriorityFilter = (value: Task['priority'] | null) => {
    dispatch(setFilter({ priority: value }));
  };

  const handleDateFilter = (dates: any) => {
    if (dates) {
      dispatch(setFilter({ dateRange: [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] }));
    } else {
      dispatch(setFilter({ dateRange: null }));
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchInput('');
    form.resetFields();
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleFinish = (values: any) => {
    const taskData: Task = {
      ...values,
      id: editingTask ? editingTask.id : Date.now().toString(),
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
    };

    if (editingTask) {
      dispatch(updateTask(taskData));
      message.success('Issue updated');
    } else {
      dispatch(addTask(taskData));
      message.success('Issue created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
    message.success('Issue deleted');
  };

  const handleBulkDelete = () => {
    dispatch(deleteManyTasks(selectedRowKeys as string[]));
    setSelectedRowKeys([]);
    message.success(`${selectedRowKeys.length} issues deleted`);
  };

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Task, b: Task) => a.title.localeCompare(b.title),
      render: (text: string) => <span className="font-semibold text-foreground tracking-tight">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Task['status'], record: Task) => (
        <Select
          value={status}
          onChange={(newStatus) => dispatch(updateTaskStatus({ id: record.id, status: newStatus }))}
          className="w-36 !border-none"
          bordered={false}
          dropdownMatchSelectWidth={false}
          placement="bottomLeft"
        >
          <Select.Option value="todo">
            <div className="flex items-center gap-2 text-muted-foreground"><CircleDashed size={14} /> Todo</div>
          </Select.Option>
          <Select.Option value="in_progress">
            <div className="flex items-center gap-2 text-blue-500"><Activity size={14} /> In Progress</div>
          </Select.Option>
          <Select.Option value="done">
            <div className="flex items-center gap-2 text-green-500"><CheckCircle2 size={14} /> Done</div>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a: Task, b: Task) => priorityOrder[a.priority] - priorityOrder[b.priority],
      render: (priority: Task['priority']) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border",
          priority === 'high' ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50" : 
          priority === 'medium' ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50" : 
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
        )}>
          {priority}
        </span>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          {text ? (
            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
              {text.charAt(0).toUpperCase()}
            </div>
          ) : <UserCircle2 size={20} className="text-muted-foreground/50" />}
          <span className="text-sm text-muted-foreground">{text || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a: Task, b: Task) => dayjs(a.dueDate || 0).unix() - dayjs(b.dueDate || 0).unix(),
      render: (date: string) => <span className="text-muted-foreground text-sm">{date ? dayjs(date).format('MMM D, YYYY') : '-'}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: Task) => (
        <Space size="small" className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
          <Button 
            type="text" 
            size="small"
            icon={<Edit2 size={14} className="text-muted-foreground hover:text-primary transition-colors" />} 
            onClick={() => handleOpenModal(record)} 
          />
          <Popconfirm
            title="Delete issue?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" icon={<Trash2 size={14} className="text-red-500/70 hover:text-red-500 transition-colors" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <motion.div 
      className="space-y-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4 sm:gap-0">
        <div>
          <Title level={2} className="!m-0 tracking-tight !font-semibold">Issues</Title>
          <p className="text-muted-foreground mt-1 text-sm">Manage and track your team's work.</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={16} />} 
          onClick={() => handleOpenModal()}
          className="shadow-none w-full sm:w-auto"
        >
          New Issue
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <Input
          placeholder="Search issues..."
          prefix={<Search size={14} className="text-muted-foreground" />}
          onChange={handleSearch}
          value={searchInput}
          allowClear
          className="w-full sm:w-64 shadow-sm"
        />
        <Select
          mode="multiple"
          placeholder="Status"
          className="w-full sm:min-w-[160px] shadow-sm"
          onChange={handleStatusFilter}
          value={filters.status}
          allowClear
          maxTagCount="responsive"
        >
          <Select.Option value="todo">Todo</Select.Option>
          <Select.Option value="in_progress">In Progress</Select.Option>
          <Select.Option value="done">Done</Select.Option>
        </Select>
        <Select
          placeholder="Priority"
          className="w-full sm:w-32 shadow-sm"
          onChange={handlePriorityFilter}
          value={filters.priority}
          allowClear
        >
          <Select.Option value="high">High</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="low">Low</Select.Option>
        </Select>
        <RangePicker 
          className="w-full sm:w-64 shadow-sm" 
          onChange={handleDateFilter}
          value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
        />
        <Button 
          icon={<RotateCcw size={14} />} 
          onClick={handleReset}
          className="shadow-sm w-full sm:w-auto"
        />
      </div>

      <div className="border border-border bg-card rounded-lg overflow-hidden shadow-sm">
        {selectedRowKeys.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="flex items-center justify-between bg-primary/5 p-3 border-b border-border"
          >
            <span className="text-primary text-sm font-medium">{selectedRowKeys.length} selected</span>
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} issues?`}
              onConfirm={handleBulkDelete}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger size="small" icon={<Trash2 size={14} />} className="shadow-none">
                Delete Selected
              </Button>
            </Popconfirm>
          </motion.div>
        )}
        
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            columnWidth: 40,
          }}
          size="middle"
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          rowClassName="group"
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: filteredTasks.length,
            onChange: (page) => dispatch(setPage(page)),
            showSizeChanger: false,
            className: "px-4 pb-4 m-0"
          }}
        />
      </div>

      <Modal
        title={<span className="text-lg font-semibold tracking-tight">{editingTask ? 'Edit Issue' : 'New Issue'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        className="!w-full max-w-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: 'todo',
            priority: 'medium',
          }}
          className="mt-6 space-y-4"
        >
          <Form.Item
            name="title"
            label="Issue Title"
            rules={[{ required: true, message: 'Please enter title' }]}
            className="mb-0"
          >
            <Input placeholder="E.g. Fix navigation bug" className="text-base py-1.5" />
          </Form.Item>

          <Form.Item name="description" label="Description" className="mb-0">
            <Input.TextArea placeholder="Add more details..." rows={4} className="resize-none" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
                className="mb-0"
              >
                <Select>
                  <Select.Option value="todo"><div className="flex items-center gap-2"><CircleDashed size={14} /> Todo</div></Select.Option>
                  <Select.Option value="in_progress"><div className="flex items-center gap-2"><Activity size={14} /> In Progress</div></Select.Option>
                  <Select.Option value="done"><div className="flex items-center gap-2"><CheckCircle2 size={14} /> Done</div></Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true }]}
                className="mb-0"
              >
                <Select>
                  <Select.Option value="high">High</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="low">Low</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="Assignee" className="mb-0">
                <Input placeholder="E.g. John Doe" prefix={<UserCircle2 size={14} className="text-muted-foreground mr-1" />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date" className="mb-0">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Tags" className="mb-6">
            <Select mode="tags" placeholder="Select or create tags" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Save Changes' : 'Create Issue'}
            </Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default TaskList;
