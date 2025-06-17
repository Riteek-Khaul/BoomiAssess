import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const Navbar = () => {

    const navigate = useNavigate();

    const goToHelp = () => {
      navigate('/help');
    };


  return (
    <div id="navbar" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <button>
        Home
      </button>
      <button id="helpButton" onClick={goToHelp}>
        Help
      </button>
      {/* User icon and name at top right */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <img
          src="/user.png"
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