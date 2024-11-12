import React,{useState, useEffect} from 'react';

const PIPO = () => {
    const [uri, setUri] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add any form submission logic here
        console.log('Submitted:', { uri, username, password });
        // For example, you can send a request to a server
    };

    return (
        <div className='PIPOContainer'>
            <h1>Extraction</h1>
            <form onSubmit={handleSubmit}>
                <div className='PIPOForm' >
                    <label htmlFor="uri" className='PIPOFormLabel' >URI:</label>
                    <input
                        type="text"
                        id="uri"
                        value={uri}
                        onChange={(e) => setUri(e.target.value)}
                        placeholder="Enter URI"
                        className='PIPOFormInput'
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className='PIPOFormInput'
                    />
                </div>
                <button type="submit" className='PIPOFormButton'>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PIPO