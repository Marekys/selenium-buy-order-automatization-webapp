import React, { useState } from 'react';
import "./RunBOs.css"
import { useAuth } from "../../Components/login/authContext.jsx"

const CalculatePrice = ({ updateCallback }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
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
        
        let intervalId;
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            intervalId = setInterval(() => {
                updateCallback();
            }, 2000);
    
            const response = await fetch('http://127.0.0.1:5000/calculate', {
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
            <button onClick={handleOpenModal} className='mr-4 px-4 py-3.5 text-base font-bold text-center no-underline bg-red-700 text-white border-none rounded'>
                Calculate Balance
            </button>

            {isOpen && (
                <div className="modal">
                    <div className='modal-content items-start w-max'>
                        <span className="close" onClick={handleCloseModal}>&times;</span>

                        <div>
                            <input className='upload-file-style' type="file" onChange={handleFileUpload} />
                        </div>
                        <button onClick={handleAutomate} className='automateButton w-3/4 ml-8 mt-8'>Calculate Used Balance</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatePrice;