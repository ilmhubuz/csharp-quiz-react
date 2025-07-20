import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { EnhancedQuizApp } from './EnhancedQuizApp';
import { ManagementProgressPage } from './ManagementProgressPage';
import { hasRole } from '../lib/auth-utils';

export const AppRouter: React.FC = () => {
    const { keycloak } = useKeycloak();

    return (
        <Router>
            <Routes>
                {/* Main quiz application */}
                <Route path="/" element={<EnhancedQuizApp />} />
                
                {/* Management routes - protected by admin role */}
                <Route 
                    path="/management/progress" 
                    element={
                        keycloak.authenticated && hasRole(keycloak, 'quiz-admin:read') 
                            ? <ManagementProgressPage />
                            : <Navigate to="/" replace />
                    } 
                />
                
                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}; 