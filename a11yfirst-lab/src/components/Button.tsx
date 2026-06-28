import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(function Button(
  { children, className = '', variant = 'secondary', type = 'button', ...props },
  ref
) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} ref={ref} type={type} {...props}>
      {children}
    </button>
  );
});
