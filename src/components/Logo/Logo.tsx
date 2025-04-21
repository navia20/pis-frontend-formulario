import React from 'react';
import './Logo.css';

export const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <div className="logo logo-left"></div>
      <div className="logo logo-right"></div>
    </div>
  );
};