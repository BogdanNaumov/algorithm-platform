import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import AddAlgorithm from './pages/AddAlgorithm';
import Profile from './pages/Profile';

// Создаем отдельный компонент для основного контента, который использует useLocation
function AppContent() {
  const [activeTab, setActiveTab] = useState('/');
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const tabVariants = {
    active: {
      scale: 1,
      color: "#ffffff",
      transition: { duration: 0.2 }
    },
    inactive: {
      scale: 0.95,
      color: "rgba(255, 255, 255, 0.8)",
      transition: { duration: 0.2 }
    }
  };

  const underlineVariants = {
    active: {
      width: "100%",
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    inactive: {
      width: "0%",
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const pageVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    in: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    out: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">AlgoPlatform</Link>
        </div>
        <div className="nav-links">
          <motion.div 
            className={`nav-item ${activeTab === '/' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" onClick={() => setActiveTab('/')}>
              <motion.span
                variants={tabVariants}
                animate={activeTab === '/' ? 'active' : 'inactive'}
              >
                Поиск
              </motion.span>
              <motion.div 
                className="nav-underline"
                variants={underlineVariants}
                animate={activeTab === '/' ? 'active' : 'inactive'}
              />
            </Link>
          </motion.div>

          <motion.div 
            className={`nav-item ${activeTab === '/add-algorithm' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/add-algorithm" onClick={() => setActiveTab('/add-algorithm')}>
              <motion.span
                variants={tabVariants}
                animate={activeTab === '/add-algorithm' ? 'active' : 'inactive'}
              >
                Добавить алгоритм
              </motion.span>
              <motion.div 
                className="nav-underline"
                variants={underlineVariants}
                animate={activeTab === '/add-algorithm' ? 'active' : 'inactive'}
              />
            </Link>
          </motion.div>

          <motion.div 
            className={`nav-item ${activeTab === '/profile' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/profile" onClick={() => setActiveTab('/profile')}>
              <motion.span
                variants={tabVariants}
                animate={activeTab === '/profile' ? 'active' : 'inactive'}
              >
                Профиль
              </motion.span>
              <motion.div 
                className="nav-underline"
                variants={underlineVariants}
                animate={activeTab === '/profile' ? 'active' : 'inactive'}
              />
            </Link>
          </motion.div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              key="home"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <Home />
            </motion.div>
          } />
          <Route path="/add-algorithm" element={
            <motion.div
              key="add-algorithm"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <AddAlgorithm />
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div
              key="profile"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <Profile />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

// Основной компонент App теперь только оборачивает в Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;