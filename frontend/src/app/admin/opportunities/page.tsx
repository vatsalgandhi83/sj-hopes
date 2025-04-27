'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import AdminOpportunitiesSection from '../../components/AdminOpportunitiesSection';
import { useAuth } from '../../hooks/useAuth';

export default function AdminOpportunitiesPage() {
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
      <AdminOpportunitiesSection />
    </Layout>
  );
} 