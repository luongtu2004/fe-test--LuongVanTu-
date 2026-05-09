import React from 'react';
import { Tag } from 'antd';
import { Task } from '../types/task';

interface StatusTagProps {
  status: Task['status'];
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const config = {
    todo: { color: 'default', text: 'TODO' },
    in_progress: { color: 'processing', text: 'IN PROGRESS' },
    done: { color: 'success', text: 'DONE' },
  };

  const { color, text } = config[status];

  return <Tag color={color}>{text}</Tag>;
};

export default StatusTag;
