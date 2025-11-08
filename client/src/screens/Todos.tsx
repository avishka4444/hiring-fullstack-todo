import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined, ReloadOutlined, LoadingOutlined, CloseOutlined, LogoutOutlined } from '@ant-design/icons';
import { todoApi } from '../services/TodoService';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/Todo';
import { useAuth } from '../context/AuthContext';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const Todos = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo
  const handleCreateTodo = async (data: CreateTodoDto) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newTodo = await todoApi.createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a todo
  const handleUpdateTodo = async (data: CreateTodoDto) => {
    if (!editingTodo) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updateData: UpdateTodoDto = {
        title: data.title,
        description: data.description,
      };
      const updatedTodo = await todoApi.updateTodo(editingTodo.id, updateData);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setEditingTodo(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle todo done status
  const handleToggleTodo = async (id: string) => {
    try {
      setError(null);
      // Optimistic update
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );

      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      // Revert optimistic update on error
      fetchTodos();
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      console.error('Error toggling todo:', err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      // Optimistic update
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      await todoApi.deleteTodo(id);
    } catch (err) {
      // Revert optimistic update on error
      fetchTodos();
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  // Start editing a todo - fetch latest version from server
  const handleStartEdit = async (todo: Todo) => {
    try {
      setError(null);
      // Fetch the latest version of the todo from the server
      const latestTodo = await todoApi.getTodoById(todo.id);
      setEditingTodo(latestTodo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load todo for editing';
      setError(errorMessage);
      console.error('Error fetching todo for editing:', err);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 pt-8 sm:pt-12 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center relative">
          <button
            onClick={handleLogout}
            className="absolute top-0 right-0 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-rose-500 hover:text-rose-400"
          >
            <LogoutOutlined className="h-4 w-4" />
            Logout {user?.username && `(${user.username})`}
          </button>
          <span className="self-center rounded-full border border-primary-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-200">
            Task Management
          </span>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            📝 TODO App
          </h1>
          <p className="text-base text-slate-400 sm:text-lg">
            Manage your tasks efficiently. Create, edit, and track your todos.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/50 bg-rose-950/20 p-4">
            <ExclamationCircleOutlined className="h-5 w-5 flex-shrink-0 text-rose-400" />
            <div className="flex-1 flex items-center justify-between">
              <p className="text-sm text-rose-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-rose-400 hover:text-rose-300 font-bold ml-4"
              >
                <CloseOutlined />
              </button>
            </div>
          </div>
        )}

        {/* Todo Form */}
        <div className="card flex flex-col gap-6 p-6">
          <header>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {editingTodo ? 'Edit Todo' : 'Create New Todo'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {editingTodo
                ? 'Update the title and description of your todo.'
                : 'Add a new task with a title and optional description.'}
            </p>
          </header>
          <TodoForm
            onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
            onCancel={editingTodo ? handleCancelEdit : undefined}
            initialData={editingTodo || undefined}
            isLoading={isSubmitting}
          />
        </div>

        {/* Todo List */}
        <div className="card flex flex-col gap-6 p-6">
          <header className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Your Todos
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {todos.length === 0
                  ? 'No todos yet'
                  : `${todos.length} ${todos.length === 1 ? 'todo' : 'todos'}`}
              </p>
            </div>
            {todos.length > 0 && (
              <button
                onClick={fetchTodos}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-primary-400 hover:text-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ReloadOutlined className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </header>

          {isLoading ? (
            <div className="text-center py-12">
              <LoadingOutlined className="text-4xl text-primary-500" spin />
              <p className="mt-4 text-slate-400">Loading todos...</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleStartEdit}
              isLoading={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Todos;

