'use client';

import React from 'react';
import Layout from '../components/Layout';
import AdminSection from '../components/AdminSection';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isLoggedIn, userType, logout, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && (!isLoggedIn || userType !== 'admin')) {
      router.push('/');
    }
  }, [isLoggedIn, userType, loading, router]);

  const handleLoginClick = () => {
    router.push('/');
  };

  if (loading) {
    return null;
  }
  if (!isLoggedIn || userType !== 'admin') {
    return null;
  }

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      userType={userType}
      onLoginClick={handleLoginClick}
      onLogout={logout}
    >
      <AdminSection />
    </Layout>
  );
} 