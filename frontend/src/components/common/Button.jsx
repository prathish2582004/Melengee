import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  style = {},
  className = '',
  fullWidth = false,
  ...props
}) => {
  const variantClass = {
    primary: 'btn-melangee-primary',
    secondary: 'btn-melangee-secondary',
    outline: 'btn-melangee-outline',
    danger: 'btn-melangee-primary', // with red override below
  }[variant] || 'btn-melangee-primary';

  const customStyle = {
    ...style,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.7 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    ...(variant === 'danger' ? { background: 'var(--danger)', borderColor: 'var(--danger)' } : {}),
  };

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={customStyle}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

