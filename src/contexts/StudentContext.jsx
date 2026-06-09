"use client";

import React, { createContext, useContext } from 'react';

const StudentContext = createContext({
  currentLevel: '',
});

export function StudentProvider({ children, initialLevel }) {
  return (
    <StudentContext.Provider value={{ currentLevel: initialLevel }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}
