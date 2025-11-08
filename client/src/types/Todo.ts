export interface Todo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
}

