import React, { useState, useEffect } from 'react';
import "./HowToGuide.css";
import "../../index.css"

const HowToGuide = () => {
  const [isVideoVisible, setVideoVisible] = useState(false);

  const handleToggleVideo = () => {
    setVideoVisible(!isVideoVisible);
  };

  return (
    <div className='main-section-holder'>
      <div className='main-section-style'>
        <div className="homepage-header-text-home"> How to automate your buy-orders</div>
        <div className='homepage-small-text-home'>
          <div>
              <button onClick={handleToggleVideo} className="toggle-video-button">
                {isVideoVisible ? 'Hide Preview' : 'Watch Preview'}
              </button>
              {isVideoVisible && (
                <div className="video-container">
                  <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/DkjPQh2yl9I" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            <li className="number-step">
              <span className="step-number">1</span> 
              <div className='step'>For each automation process, you need to first load your Steam Account cookies in the cookies page.</div>
            </li>
            <li className="number-step">
              <span className="step-number">2</span> 
              <div className='step'>Cookies should be new every time you want to automate your buy orders.</div>
            </li>
            <li className="number-step">
              <span className="step-number">3</span> 
              <div className='step'>After successfully downloading cookies, you can proceed to the Automate page.</div>
            </li>
            <li className="number-step">
              <span className="step-number">4</span> 
              <div className='step'>In the Automate tab, it is important to add the Steam items you want to automate.</div> 
            </li>
            <li className="number-step">
              <span className="step-number">5</span> 
              <div className='step'>Proceed to the Automate button and add the cookies file you downloaded and the time at which you want to start the automation.</div>
            </li>
            <li className="number-step">
              <span className="step-number">6</span> 
              <div className='step'>Watch each item's Buy Order status and enjoy.</div>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToGuide;