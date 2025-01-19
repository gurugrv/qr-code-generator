import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearToast } from '../features/toast/toastSlice';

interface ToastProps {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => dispatch(clearToast(id)), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch, id]);

  const toastColors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`${
        isVisible ? 'animate-fade-in' : 'animate-fade-out'
      } transform transition-all duration-300 ${toastColors[type]} text-white px-4 py-2 rounded-md shadow-lg mb-2`}
    >
      {message}
    </div>
  );
};

const ToastsContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
};

export default ToastsContainer;

export const showErrorToast = (payload: { message: string; code?: string }) => ({
  type: 'toast/showToast',
  payload: {
    id: Math.random().toString(36).substr(2, 9),
    message: `${payload.message}${payload.code ? ` (${payload.code})` : ''}`,
    type: 'error',
  },
});