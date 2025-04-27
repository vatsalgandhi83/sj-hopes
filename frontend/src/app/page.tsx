// src/app/page.tsx
'use client'; // Directive needed for hooks and event handlers

import React, { useState } from 'react';
// Adjust import paths if your components folder is elsewhere
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import DashboardSection from './components/DashboardSection';
import SheltersSection from './components/SheltersSection';
import TasksSection from './components/TasksSection';
import AdminSection from './components/AdminSection';
import Modal from './components/Modal';
import Toast from './components/Toast';

// Define types used across the component
type UserType = 'caseworker' | 'admin' | '';
type Section = 'dashboard' | 'shelters' | 'tasks' | 'admin';

export default function HomePage() {
  // --- State Variables ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>('');
  const [userName, setUserName] = useState<string>('');
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  // State for Modal and Toast
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(''); // Can hold JSX
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // --- Login/Logout Handlers ---
  const handleLogin = (type: UserType, email: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserName(type === 'admin' ? 'Admin' : 'Caseworker'); // Replace with actual name if available
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('');
    setUserName('');
    // Optionally redirect or reset section
    // setActiveSection('dashboard');
  };

  // --- Navigation Handler ---
  const handleNavigate = (section: Section) => {
    setActiveSection(section);
  };

  // --- Modal & Toast Handlers ---
  const showModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalTitle(''); // Clear modal content on close
    setModalContent('');
    // Optional: Show toast after modal closes
    showToast('Action completed successfully!');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    // Toast component handles its own timeout for hiding
  };

  // Example functions to pass down to child components
   const handleReserveBed = (shelterName: string) => {
     showModal('Reserve Bed at', `Confirm reservation for ${shelterName}?`);
     // Add actual reservation logic inside closeModal or a confirm button in Modal
   };

   const handleAssignTask = (taskName: string) => {
      showModal('Assign Task', `Confirm assignment of task: ${taskName}?`);
      // Add actual assignment logic
   };

  // --- Render Logic ---
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    // Using a Fragment as RootLayout provides the body tag
    <>
      <Navbar
        userType={userType}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        activeSection={activeSection}
      />
      {/* Main content area */}
      <main>
        {activeSection === 'dashboard' && <DashboardSection userName={userName} />}
        {activeSection === 'shelters' && <SheltersSection /* Pass props like onReserveBed={handleReserveBed} */ />}
        {activeSection === 'tasks' && <TasksSection />}
        {activeSection === 'admin' && userType === 'admin' && <AdminSection />}
      </main>

      {/* Render Modal and Toast - Consider using React Portals for better DOM placement */}
      <Modal
          isVisible={modalVisible}
          title={modalTitle}
          content={modalContent}
          onClose={closeModal}
        />
       <Toast
          isVisible={toastVisible}
          message={toastMessage}
          // Reset visibility state when toast dismisses itself (optional)
          onDismiss={() => setToastVisible(false)}
        />
    </>
  );
}