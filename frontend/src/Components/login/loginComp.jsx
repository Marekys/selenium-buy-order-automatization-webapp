import React, { useState } from 'react';
import { useAuth } from './authContext.jsx';
import "./loginModal.css"
import "../../index.css"

const Login = ({ closeModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit} className='form-style'>
            <input 
                className='text-input-style'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className='text-input-style'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button className='start-button' type="submit">Login</button>
        </form>
    );
};

export default Login;