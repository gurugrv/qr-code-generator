import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import ToastsContainer from './components/Toasts';
import { useAppSelector } from './store/store';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  const darkMode = useAppSelector(state => state.ui.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <GoogleMapsLoader>
        <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </AppLayout>
      <ToastsContainer />
      </GoogleMapsLoader>
    </Router>
  );
}

export default App;
