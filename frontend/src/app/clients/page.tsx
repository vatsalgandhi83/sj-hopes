'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ClientManagement from '../components/ClientManagement';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function ClientsPage() {
  const router = useRouter();
  const { isLoggedIn, userType, logout, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, loading, router]);

  const handleLoginClick = () => {
    router.push('/');
  };

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      userType={userType}
      onLoginClick={handleLoginClick}
      onLogout={logout}
    >
      <ClientManagement />
    </Layout>
  );
} 