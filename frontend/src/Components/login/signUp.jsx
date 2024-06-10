import React, { useState } from 'react';
import { useAuth } from './authContext.jsx';
import "./loginModal.css"
import "../../index.css"

const SignUp = ({ closeModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, email);
            alert('Registration successful');
            closeModal();
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
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
            <input
                className='text-input-style'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button className='start-button' type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;