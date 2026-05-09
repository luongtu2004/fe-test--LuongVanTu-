import { Task } from '../types/task';
import dayjs from 'dayjs';

export const mockTasks: Task[] = Array.from({ length: 25 }, (_, i) => {
  const id = (i + 1).toString();
  const statuses: Task['status'][] = ['todo', 'in_progress', 'done'];
  const priorities: Task['priority'][] = ['low', 'medium', 'high'];
  const tagsList = ['React', 'TypeScript', 'AntD', 'Tailwind', 'Redux', 'Vite'];
  
  return {
    id,
    title: `Task ${id}: Implement ${['Feature', 'Bug fix', 'Refactoring', 'Documentation', 'Unit test'][i % 5]} ${i + 1}`,
    description: `Detailed description for task ${id}. This task involves various steps to ensure high quality and performance.`,
    status: statuses[i % 3],
    priority: priorities[i % 3],
    assignee: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'][i % 5],
    dueDate: dayjs().add(i % 10, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(i % 5, 'day').toISOString(),
    tags: [tagsList[i % 6], tagsList[(i + 1) % 6]],
  };
});
