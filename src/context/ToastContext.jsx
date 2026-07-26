import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-panel"
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '280px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              borderLeft: `4px solid ${
                toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#06b6d4'
              }`,
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            {toast.type === 'success' && <CheckCircle2 size={20} color="#10b981" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#f43f5e" />}
            {toast.type === 'info' && <Info size={20} color="#06b6d4" />}
            <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
