import React, { useState } from 'react';
import "./RunBOs.css"
import { useAuth } from "../../Components/login/authContext.jsx"

const RunBOs = ({ updateCallback }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [hour, setHour] = useState('0');
    const { user } = useAuth();
    
    
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAutomate = async () => {
        handleCloseModal();
    
        if (!file) {
            alert("Please upload a file before starting automation.");
            return;
        }
        
        const hourAsNumber = +hour;
        let intervalId;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hour', hourAsNumber)
    
        try {
            intervalId = setInterval(() => {
                updateCallback();
            }, 2000);
    
            const response = await fetch('http://127.0.0.1:5000/automate', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to start automation process');
            } else {
                updateCallback();
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            clearInterval(intervalId);
        }
    };

    const handleHourInputChange = (event) => {
        const inputValue = event.target.value;
        setHour(inputValue);
    };
    
    return (
        <div>
            <button onClick={handleOpenModal} className='runningItems'>Run automation</button>

            {isOpen && (
                <div className="modal">
                    <div className='modal-content'>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <div>
                            <input 
                                type="text" 
                                className='text-input-style' 
                                placeholder="Enter starting Hour" 
                                value={hour}
                                onChange={handleHourInputChange}
                            />
                        </div>
                        <div>
                            <input className='upload-file-style' type="file" onChange={handleFileUpload} />
                        </div>
                        <button onClick={handleAutomate} className='automateButton'>Automate</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RunBOs;