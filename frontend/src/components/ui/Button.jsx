import { forwardRef } from 'react';
import styles from './Button.module.css';

const variants = {
  primary: styles.primary,
  outline: styles.outline,
  soft: styles.soft,
  link: styles.link,
};

export const Button = forwardRef(function Button(
  { variant = 'outline', className = '', children, ...rest },
  ref,
) {
  return (
    <button ref={ref} type="button" className={`${styles.base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
});
