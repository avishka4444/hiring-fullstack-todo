import { ExclamationCircleOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | ReactNode;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Todo',
  message = 'Are you sure you want to delete this todo? This action cannot be undone.',
  isLoading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div className="card w-full max-w-md p-6" style={{ animation: 'zoomIn 0.2s ease-out' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20">
              <ExclamationCircleOutlined className="text-rose-400" style={{ fontSize: '24px' }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-white leading-tight">{title}</h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed p-1"
                aria-label="Close"
              >
                <CloseOutlined style={{ fontSize: '16px' }} />
              </button>
            </div>
            <div className="text-sm text-slate-300 mb-6">
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <LoadingOutlined spin style={{ fontSize: '16px' }} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

