import { FileTextOutlined } from '@ant-design/icons';
import type { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void | Promise<void>;
  isLoading?: boolean;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  isLoading = false,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800/50 border border-slate-700 mb-6">
          <FileTextOutlined className="text-slate-400" style={{ fontSize: '2.5rem' }} />
        </div>
        <p className="text-slate-300 text-base sm:text-lg font-medium mb-2">
          No todos yet
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Create your first todo to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

