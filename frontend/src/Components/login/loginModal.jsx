import React, { useState } from 'react';
import Login from './loginComp.jsx';
import SignUp from './signUp.jsx';
import './loginModal.css';

const LoginModal = ({ closeModal }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                {isLogin ? <Login closeModal={closeModal} /> : <SignUp closeModal={closeModal} />}
                <div>
                    {isLogin ? 'Not yet signed? ' : 'Already have an account? '}
                    <span className="toggle-link" onClick={toggleForm}>
                        {isLogin ? ' Sign Up here' : ' Login here'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;