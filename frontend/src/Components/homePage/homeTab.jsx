import React from 'react';
import "./homeTab.css"
import "../../styles.css"


function HomeTab() {
    const handleClick = () => {
        window.open('https://www.youtube.com/watch?v=DkjPQh2yl9I', '_blank');
      };

    return (
        <div className='main-section-holder'>
            <div className='main-section-style-homepage'>
                <div className='homepage-header-text-home'> Automate your buy orders.</div>
                <div className='homepage-small-text-home'>
                Welcome to our dedicated platform for automating Steam Buy Orders.
                Say goodbye to stress and time constraints; we'll handle everything for you. <br></br>
                </div>
                <button onClick={handleClick} className="start-button">
                Get Started
                </button>
                <div className='screen-container'>
                    <img src="https://i.imgur.com/erWQI7k.jpeg" alt="Description of the image"></img>
                </div>
            </div>
        </div>
    );
}

export default HomeTab;