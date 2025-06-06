import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Chatbot from '../pages/Chatbot';
import Journaling from '../pages/Journaling';
import HealthCheck from '../pages/healthCheck';
import Rekomendasi from '../pages/Rekomendasi';
import PrivateRoute from '../components/PrivateRoute';
import AboutUsPage from '../pages/AboutUsPage';
import FeaturesPage from '../pages/FeaturesPage';
import BenefitsPage from '../pages/BenefitsPage';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/FooterSection';
import LandingLayout from '../components/LandingLayout';
import AuthCallback from '../pages/AuthCallback';
import '../styles/PageTransitions.css';
import React, { useRef } from 'react';

function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  const transitionRoutes = ['/', '/about', '/features', '/benefits'];

  const isTransitionRoute = transitionRoutes.includes(location.pathname);

  return (
    <>
      {isTransitionRoute ? (
        <>
          <LandingNavbar />
          <TransitionGroup component={null}>
            <CSSTransition
              nodeRef={nodeRef}
              key={location.key}
              timeout={800}
              classNames="fade"
              unmountOnExit
            >
              <div ref={nodeRef} style={{ position: 'relative', zIndex: 1 }}>
                <Routes location={location}>
                  <Route path="/" element={<LandingLayout><LandingPage /></LandingLayout>} />
                  <Route path="/about" element={<LandingLayout><AboutUsPage /></LandingLayout>} />
                  <Route path="/features" element={<LandingLayout><FeaturesPage /></LandingLayout>} />
                  <Route path="/benefits" element={<LandingLayout><BenefitsPage /></LandingLayout>} />
                </Routes>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </>
      ) : (
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/chatbot" element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          } />
          <Route path="/journaling" element={
            <PrivateRoute>
              <Journaling />
            </PrivateRoute>
          } />
          <Route path="/HealthCheck" element={
            <PrivateRoute>
              <HealthCheck />
            </PrivateRoute>
          } />
          <Route path="/Rekomendasi" element={
            <PrivateRoute>
              <Rekomendasi />
            </PrivateRoute>
          } />
        </Routes>
      )}
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
