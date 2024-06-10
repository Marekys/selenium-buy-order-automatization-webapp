import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Components/login/authContext.jsx';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('http://127.0.0.1:5000/messages', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            }
        };

        fetchMessages();
    }, [user.token]);

    return (
        <div className='main-section-holder'>
            <div className='main-section-style'>
                <h1 className='homepage-header-text-home'>Messages</h1>
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <h3>{message.subject}</h3>
                            <p>{message.text}</p>
                            <p><strong>{message.email}</strong> at {new Date(message.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Messages;