import React from 'react';
import "./HowToGuide.css";
import "../../index.css"

const HowToGuide = () => {
    return (
        <div className='main-section-holder'>
            <div className='main-section-style'>
                <div className="homepage-header-text-home"> How to automate your buy-orders</div>
                <div className='homepage-small-text-home'>
    <div>
      <li className="number-step">
        <span className="step-number">1</span> 
        <div className='step'>For each automatization process you need to first load your Steam Account cookies in the cookies page.</div>
      </li>
      <li className="number-step">
        <span className="step-number">2</span> 
        
        <div className='step'>Cookies should be new everytime you want to automate your buy orders.</div>
      </li>
      <li className="number-step">
        <span className="step-number">3</span> 
        
        <div className='step'>After succesfully downloading cookies you can proceed to Automate page.</div>
      </li>
      <li className="number-step">
        <span className="step-number">4</span> 
        
        <div className='step'>In automate tab it is important to add steam items you want to automate.</div> 
      </li>
      <li className="number-step">
        <span className="step-number">5</span> 
        
        <div className='step'>Proceed to Automate button and add the cookies file you downloaded and time at which you want to start the automatization.</div>
      </li>
      <li className="number-step">
        <span className="step-number">6</span> 
        <div className='step'>Watch each items Buy Order status and Enjoy.</div>
        
      </li>
    </div>
                </div>
            </div>

        </div>
    );
};

export default HowToGuide;