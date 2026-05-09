import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFilters, PaginationState } from '../../types/task';
import { mockTasks } from '../../utils/mockData';
import { RootState } from '../../store';

interface TasksState {
  items: Task[];
  filters: TaskFilters;
  pagination: PaginationState;
}

const initialState: TasksState = {
  items: mockTasks,
  filters: {
    searchText: '',
    status: [],
    priority: null,
    dateRange: null,
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    deleteManyTasks: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter((t) => !action.payload.includes(t.id));
    },
    setFilter: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteManyTasks,
  setFilter,
  resetFilters,
  setPage,
} = tasksSlice.actions;

const selectTasks = (state: RootState) => state.tasks.items;
const selectFilters = (state: RootState) => state.tasks.filters;
const selectPagination = (state: RootState) => state.tasks.pagination;

export const selectAllTasks = createSelector([selectTasks], (items) => items);

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (items, filters) => {
    return items.filter((task) => {
      const matchSearch = task.title.toLowerCase().includes(filters.searchText.toLowerCase());
      const matchStatus = filters.status.length === 0 || filters.status.includes(task.status);
      const matchPriority = !filters.priority || task.priority === filters.priority;
      const matchDate =
        !filters.dateRange ||
        (task.dueDate &&
          task.dueDate >= filters.dateRange[0] &&
          task.dueDate <= filters.dateRange[1]);

      return matchSearch && matchStatus && matchPriority && matchDate;
    });
  }
);

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectPagination],
  (filteredTasks, pagination) => {
    const { currentPage, pageSize } = pagination;
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }
);

export const selectTaskStats = createSelector([selectTasks], (items) => {
  return items.reduce(
    (acc, task) => {
      acc.total++;
      if (task.status === 'todo') acc.todo++;
      if (task.status === 'in_progress') acc.in_progress++;
      if (task.status === 'done') acc.done++;
      return acc;
    },
    { total: 0, todo: 0, in_progress: 0, done: 0 }
  );
});

export default tasksSlice.reducer;
