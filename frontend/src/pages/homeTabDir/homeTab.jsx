import React from 'react';
import "./homeTab.css"
import "../../styles.css"


function HomeTab() {
    return (
        <div className='main-section-holder'>
            <div className='main-section-style-homepage'>
                <div className='homepage-header-text-home'> Automate your buy orders.</div>
                <div className='homepage-small-text-home'>
                Welcome to our dedicated platform for automating Steam Buy Orders.
                Say goodbye to stress and time constraints; we'll handle everything for you. <br></br>
                </div>
                <button className='start-button'>Get Started</button>
                <div className='screen-container'>
                    <img src="https://i.imgur.com/erWQI7k.jpeg" alt="Description of the image"></img>
                </div>
            </div>
        </div>
    );
}

export default HomeTab;