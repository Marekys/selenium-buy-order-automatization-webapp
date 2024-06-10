import React, { useState } from 'react';
import { User, Mail} from "react-feather"
import "./contactForm.css"


const ContactForm = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, subject, text })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Message sent successfully');
            setEmail('');
            setSubject('');
            setText('');
        } else {
            setMessage(data.error);
        }
    };


    return (
        <div className="main-section-style-contact">
            <form onSubmit={handleSubmit}>
                <h1 className="title-text">Talk to Us</h1>
                <div className="form-group input-group">
                    <label htmlFor="formEmail" className="d-block">
                        <Mail className="input-icon" />
                    </label>
                    <input
                        id="formEmail" 
                        className="form-control form-control-lg thick" 
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group input-group">
                    <label className="d-block" htmlFor="formSubject">
                        <User className="input-icon" />
                    </label>
                    <input
                        type="text"     
                        id="formEmail"  
                        className="form-control form-control-lg thick" 
                        placeholder="Subject"  
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group message">
                    <label></label>
                    <textarea
                        className="form-control form-control-lg" 
                        rows="7" 
                        placeholder="Message"
                        id="formMessage"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary" tabIndex="-1">Send message</button>
                </div>
            </form>
        {message && <p>{message}</p>}
    </div>
    );
};

export default ContactForm;