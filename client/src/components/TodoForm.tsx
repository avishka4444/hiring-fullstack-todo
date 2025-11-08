import { useState, useEffect, type FormEvent } from 'react';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { CreateTodoDto, Todo } from '../types/Todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoDto) => Promise<void>;
  onCancel?: () => void;
  initialData?: Todo;
  isLoading?: boolean;
}

export default function TodoForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');

  // Update form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      // Reset form when creating new todo
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      // Reset form only if creating new todo (not editing)
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-500/50 bg-rose-950/20 p-3">
          <ExclamationCircleOutlined className="h-5 w-5 flex-shrink-0 text-rose-400" />
          <p className="flex-1 text-sm text-rose-400">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
          Title <span className="text-rose-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter todo title"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
          Description <span className="text-slate-500 text-xs">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter todo description"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary-500 px-6 text-sm font-semibold text-white shadow-lg shadow-primary-900/40 transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoadingOutlined className="mr-2" spin />
              Saving...
            </>
          ) : initialData ? (
            'Update Todo'
          ) : (
            'Add Todo'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-700 px-6 text-sm font-semibold text-slate-200 transition hover:border-primary-400 hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

