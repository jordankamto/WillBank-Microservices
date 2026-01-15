import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

/**
 * Composant Spinner (indicateur de chargement)
 */

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#2563eb',
  fullScreen = false
}) => {
  const spinnerClasses = ['spinner', `spinner-${size}`].join(' ');

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={spinnerClasses} style={{ borderTopColor: color }} />
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={spinnerClasses} style={{ borderTopColor: color }} />
    </div>
  );
};