import React from 'react'
import './App.css';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {

    const navigate = useNavigate();

    const Home =()=>{
        navigate('/home');
    }

    return (
        <div id="responsePage">
             <h2>Response!</h2>
         <h3 id="response-data">Data(files) Saved to local drive Successfully!</h3>
         <button onClick={Home}>Back to Home</button>
        </div>
    )
}

export default SuccessPage;