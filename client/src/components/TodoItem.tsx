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
      className={`card p-3 sm:p-4 md:p-6 transition-all duration-200 ${
        todo.done ? 'opacity-60' : ''
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading || isDeleting}
          className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-500 border-slate-600 bg-slate-800 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-white text-sm sm:text-base md:text-lg break-words ${
              todo.done ? 'line-through text-slate-400' : ''
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-300 break-words ${
                todo.done ? 'line-through text-slate-500' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-slate-500">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <ClockCircleOutlined className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="hidden sm:inline">Created: </span>
              <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
            </span>
            {todo.updatedAt !== todo.createdAt && (
              <span className="flex items-center gap-0.5 sm:gap-1">
                <EnvironmentOutlined className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Updated: </span>
                <span>{new Date(todo.updatedAt).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(todo)}
            disabled={isLoading || isDeleting || todo.done}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-slate-700 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-slate-200 transition hover:border-primary-400 hover:text-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-200"
            title="Edit todo"
          >
            <EditOutlined className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isLoading || isDeleting}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-rose-500/50 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete todo"
          >
            <DeleteOutlined className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Delete</span>
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

