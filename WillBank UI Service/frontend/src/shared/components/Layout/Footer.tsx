import React from 'react';
import './Footer.css';

/**
 * Footer de l'application
 */

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        © {currentYear} WillBank - Tous droits réservés
      </p>
      <p className="footer-authors">
        Développé par KAMGAING K. Jordan, NGUETSA T. Russel, TCHOMGANG B. Nelly
      </p>
    </footer>
  );
};