import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import EmployeeDetails from './components/EmployeeDetails';
import StudentDataUpload from './components/StudentDataUpload';
import PrintIDCard from './components/PrintIDCard';
import PaymentManagement from './components/PaymentManagement';
import BackButton from './components/BackButton';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState(['dashboard']);

  const renderContent = () => {
    const showBackButton = activeSection !== 'dashboard';
    
    return (
      <>
        {showBackButton && (
          <BackButton 
            onClick={handleBack} 
            label={`Back to ${history.length > 1 ? 'Previous' : 'Dashboard'}`}
          />
        )}
        <div className="content-wrapper">
          {(() => {
            switch (activeSection) {
              case 'employee':
                return <EmployeeDetails />;
              case 'upload':
                return <StudentDataUpload />;
              case 'print':
                return <PrintIDCard />;
              case 'payment':
                return <PaymentManagement />;
              default:
                return <Dashboard setActiveSection={setActiveSection} />;
            }
          })()}
        </div>
      </>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'employee', label: 'Employee Details', icon: '👥' },
    { id: 'upload', label: 'Student Data Upload', icon: '📤' },
    { id: 'print', label: 'Print ID Card', icon: '🖨️' },
    { id: 'payment', label: 'Payment Management', icon: '💳' }
  ];

  const handleMenuClick = (sectionId) => {
    if (sectionId !== activeSection) {
      setHistory(prev => [...prev, sectionId]);
      setActiveSection(sectionId);
    }
    setMenuOpen(false);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setActiveSection(previousPage);
    } else {
      setActiveSection('dashboard');
      setHistory(['dashboard']);
    }
  };


  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo">🎓</div>
          </div>
          <div className="college-info">
            <h1 className="college-name">Brainware University</h1>
            <p className="college-tagline">Excellence in Education</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className="menu-text">Menu</span>
          </button>
          {menuOpen && (
            <>
              <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
              <nav className="dropdown-menu">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                  >
                    <span className="menu-item-icon">{item.icon}</span>
                    <span className="menu-item-label">{item.label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

