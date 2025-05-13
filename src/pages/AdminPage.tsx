import React from 'react';
import './AdminPage.css';
import { AdminPanel } from '../components/AdminPanel/AdminPanel';

export const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <AdminPanel />
    </div>
  );
};