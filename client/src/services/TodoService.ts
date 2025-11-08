import { axios } from './index';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/Todo';

interface PaginatedResponse<T> {
  count: number;
  data: T[];
}

export const todoApi = {
  // Get all TODOs
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await axios.get<PaginatedResponse<Todo>>('/todos', {
      params: { all: true },
    });
    return response.data.data;
  },

  // Get a single TODO by ID
  getTodoById: async (id: string): Promise<Todo> => {
    const response = await axios.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Create a new TODO
  createTodo: async (data: CreateTodoDto): Promise<Todo> => {
    const response = await axios.post<Todo>('/todos', data);
    return response.data;
  },

  // Update a TODO (title/description)
  updateTodo: async (id: string, data: UpdateTodoDto): Promise<Todo> => {
    const response = await axios.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  // Toggle the done status
  toggleTodo: async (id: string): Promise<Todo> => {
    const response = await axios.patch<Todo>(`/todos/${id}/done`);
    return response.data;
  },

  // Delete a TODO
  deleteTodo: async (id: string): Promise<void> => {
    await axios.delete(`/todos/${id}`);
  },
};

