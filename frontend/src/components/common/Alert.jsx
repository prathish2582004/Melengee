import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, title, onClose }) => {
  if (!message) return null;

  const styles = {
    info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: <Info size={18} color="#2563EB" /> },
    success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: <CheckCircle size={18} color="#16A34A" /> },
    error: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: <XCircle size={18} color="#DC2626" /> },
    warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: <AlertCircle size={18} color="#D97706" /> },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      style={{
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        color: current.text,
        padding: '12px 16px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '16px',
        fontSize: '0.9rem',
      }}
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>{current.icon}</div>
      <div style={{ flexGrow: 1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: '2px' }}>{title}</div>}
        <div>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: current.text,
            opacity: 0.7,
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;

