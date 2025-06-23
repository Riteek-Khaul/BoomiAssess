import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const Navbar = () => {

    const navigate = useNavigate();

    const goToHelp = () => {
      navigate('/help');
    };
    const goToHome = () => {
      navigate('/Home');
    };


  return (
    <div
      id="navbar"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/*
        Add logic to highlight the active tab.
        We'll use window.location.pathname to determine the current route.
      */}
      <button
        onClick={goToHome}
        className={window.location.pathname === '/' || window.location.pathname === '/Home' ? 'navbar-active' : ''}
        style={{
          marginRight: '8px',
          padding: '8px 16px',
          background: (window.location.pathname === '/' || window.location.pathname === '/Home') ? '#1976d2' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        Home
      </button>
      <button
        id="helpButton"
        onClick={goToHelp}
        className={window.location.pathname === '/help' ? 'navbar-active' : ''}
        style={{
          marginRight: '8px',
          padding: '8px 16px',
          background: window.location.pathname === '/help' ? '#1976d2' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        Help
      </button>
      {/* User icon and name at top right */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/user.png`}
          alt="User"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#eee',
            objectFit: 'cover',
            border: '1px solid #ccc'
          }}
        />
        <span style={{ color: 'white', fontWeight: 'bold' }}>
          Riteek Khaul
        </span>
      </div>
    </div>
  )
}

export default Navbar