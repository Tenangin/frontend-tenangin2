import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Chatbot from '../pages/Chatbot';
import Journaling from '../pages/Journaling';
import PrivateRoute from '../components/PrivateRoute';

export default function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
        </Routes>
        </BrowserRouter>
    );
}
