import { useState } from 'react';
import { ClockCircleOutlined, EnvironmentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Todo } from '../types/Todo';
import DeleteConfirmModal from './ConfirmModal';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void | Promise<void>;
  isLoading?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isLoading = false,
}: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <div
      className={`card p-4 sm:p-6 transition-all duration-200 ${
        todo.done ? 'opacity-60' : ''
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading || isDeleting}
          className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-primary-500 border-slate-600 bg-slate-800 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-white text-base sm:text-lg ${
              todo.done ? 'line-through text-slate-400' : ''
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-2 text-sm text-slate-300 ${
                todo.done ? 'line-through text-slate-500' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ClockCircleOutlined className="h-3 w-3" />
              Created: {new Date(todo.createdAt).toLocaleDateString()}
            </span>
            {todo.updatedAt !== todo.createdAt && (
              <span className="flex items-center gap-1">
                <EnvironmentOutlined className="h-3 w-3" />
                Updated: {new Date(todo.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onEdit(todo)}
            disabled={isLoading || isDeleting || todo.done}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-primary-400 hover:text-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-200"
            title="Edit todo"
          >
            <EditOutlined className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isLoading || isDeleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete todo"
          >
            <DeleteOutlined className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Todo"
        message={
          <p>
            Are you sure you want to delete <span className="font-semibold text-white">"{todo.title}"</span>? This action cannot be undone.
          </p>
        }
        isLoading={isDeleting}
      />
    </div>
  );
}

