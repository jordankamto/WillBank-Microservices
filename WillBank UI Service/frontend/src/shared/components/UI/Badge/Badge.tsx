import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'small' | 'medium';
}

/**
 * Composant Badge pour afficher des statuts
 */

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium'
}) => {
  const classes = ['badge', `badge-${variant}`, `badge-${size}`].join(' ');

  return <span className={classes}>{children}</span>;
};