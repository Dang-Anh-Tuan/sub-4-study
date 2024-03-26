import { ToastOptions, toast, ToastContent } from 'react-toastify';

export const useToast = () => {
  const DEFAULT_OPTIONS: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  };

  const createToast = (type: keyof typeof toast, message: ToastContent, customOptions?: ToastOptions) => {
    (toast[type] as (content: ToastContent, options?: ToastOptions) => number)(message, { ...DEFAULT_OPTIONS, ...customOptions });
  };

  return {
    success: (message: ToastContent, customOptions?: ToastOptions) => createToast('success', message, customOptions),
    error: (message: ToastContent, customOptions?: ToastOptions) => createToast('error', message, customOptions),
    warn: (message: ToastContent, customOptions?: ToastOptions) => createToast('warn', message, customOptions),
    info: (message: ToastContent, customOptions?: ToastOptions) => createToast('info', message, customOptions)
  };
};
