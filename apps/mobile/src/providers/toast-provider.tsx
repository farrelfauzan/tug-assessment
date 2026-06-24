import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { Snackbar } from 'react-native-paper';

type ToastTone = 'success' | 'error';

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<ToastTone>('success');

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast: (nextMessage, nextTone = 'success') => {
        setMessage(nextMessage);
        setTone(nextTone);
        setVisible(true);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={{ backgroundColor: tone === 'success' ? '#1f7a43' : '#a12d2f' }}
      >
        {message}
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
