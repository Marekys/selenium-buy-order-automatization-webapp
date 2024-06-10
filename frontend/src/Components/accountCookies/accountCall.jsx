import React, { useState, useEffect } from 'react';
import "../../index.css"

function AccountCall() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [filename, setFilename] = useState(null);

    const handleClick = () => {
        setLoading(true);
    };

    useEffect(() => {
        const loadCookies = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/load_cookies');
                if (!response.ok) {
                    throw new Error('Failed to load cookies');
                }
                const file = await response.text();
                setFilename(file);
                setDownloadUrl(`http://127.0.0.1:5000/download-cookies/${file}`);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (loading) {
            loadCookies();
        }
    }, [loading]);

    const handleDownload = async () => {
        window.location.href = downloadUrl;

        try {
            const response = await fetch(`http://127.0.0.1:5000/delete-file/${filename}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <div>
            {error && <p>Error: {error}</p>}
            {downloadUrl ? (
                <button onClick={handleDownload}>Download Cookies</button>
            ) : (
                <button className='start-button' onClick={handleClick} disabled={loading}>
                    {loading ? 'Loading...' : 'Load Cookies'}
                </button>
            )}
        </div>
    );
}

export default AccountCall;
