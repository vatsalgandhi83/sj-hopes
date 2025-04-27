'use client';

import React from 'react';
import TasksSection from '../components/TasksSection';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function OpportunitiesPage() {
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
    return null;
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
      <TasksSection />
    </Layout>
  );
} 