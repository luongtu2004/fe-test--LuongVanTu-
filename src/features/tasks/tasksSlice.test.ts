import { describe, it, expect } from 'vitest';
import { selectTaskStats } from './tasksSlice';
import { Task } from '../../types/task';
import { RootState } from '../../store';

describe('Tasks Selectors', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', status: 'todo', priority: 'high', createdAt: '' },
    { id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium', createdAt: '' },
    { id: '3', title: 'Task 3', status: 'done', priority: 'low', createdAt: '' },
    { id: '4', title: 'Task 4', status: 'done', priority: 'high', createdAt: '' },
  ];

  const mockState = {
    tasks: {
      items: mockTasks,
      filters: { searchText: '', status: [], priority: null, dateRange: null },
      pagination: { currentPage: 1, pageSize: 10 },
    }
  } as RootState;

  it('selectTaskStats should calculate correct statistics', () => {
    const stats = selectTaskStats(mockState);
    expect(stats.total).toBe(4);
    expect(stats.todo).toBe(1);
    expect(stats.in_progress).toBe(1);
    expect(stats.done).toBe(2);
  });
});
