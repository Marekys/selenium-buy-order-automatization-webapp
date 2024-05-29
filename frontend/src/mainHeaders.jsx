import React from 'react';
import { useState, useEffect } from 'react'
import { Download, Home, ToggleLeft, ToggleRight, HelpCircle, Send } from 'react-feather';
import ItemsTable from './pages/itemsTablepckg/itemsTable';
import HomeTab from './pages/homeTabDir/homeTab';
import HowToGuide from './pages/howToPack/HowToGuide';
import AccountCookies from './pages/accCookiesPack/accountCookies';
import Login from './loginComponents/loginComp.jsx'; 
import ContactForm from './pages/contactFormDir/contactForm.jsx';
import { useAuth } from './loginComponents/authContext.jsx';
import logo from './images/logo.svg';
import LoginModal from './loginComponents/loginModal.jsx';
import Messages from './pages/contactFormDir/messages.jsx';
import "./styles.css"


const MainHeaders = () => {
    const [currentSection, setCurrentSection] = useState('Home');
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshItemsTable, setRefreshItemsTable] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRefreshItemsTable = () => {
        setRefreshItemsTable(prevState => !prevState);
    };

    return (
        <>
            <div className="header">
                <div>
                    <img src={logo} alt="Logo" className="header__logo"/> {}
                </div>
                <nav className="navbar">
                    <ul className="navbar__menu">
                        <li className="navbar__item">
                            <a href="#" className="navbar__link" onClick={() => setCurrentSection('Home')}>
                                <Home />
                                <span>Home</span>
                            </a>
                        </li>
                        <li className="navbar__item">
                            <a href="#" className="navbar__link" onClick={() => setCurrentSection('HowToGuide')}>
                                <HelpCircle  />
                                <span>How to</span>
                            </a>
                        </li>
                        <li className="navbar__item">
                            <a href="#" className="navbar__link" onClick={() => setCurrentSection('AccountCookies')}>
                                <Download />
                                <span>Cookies</span>
                            </a>
                        </li>
                        <li className="navbar__item">
                            <a href="#" className="navbar__link" onClick={() => setCurrentSection('ItemsTable')}>
                                {currentSection === 'ItemsTable' ? <ToggleRight /> : <ToggleLeft />}
                                <span>Automate</span>
                            </a>
                        </li>
                        <li className="navbar__item">
                            <a href="#" className="navbar__link" onClick={() => setCurrentSection('Contact')}>
                                <Send />
                                <span>Contact Us</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div>
                    {user ? (
                        <button className="login-button" onClick={logout}>Logout</button>
                    ) : (
                        <button className="login-button" onClick={openModal}>Login</button>
                    )}
                    {isModalOpen && <LoginModal closeModal={closeModal} />}
                </div>
            </div>
            <div className='mainHalf'>
                {currentSection === 'Home' && <HomeTab/>}
                {currentSection === 'ItemsTable' && <ItemsTable refreshItemsTable={refreshItemsTable} onAutomationSuccess={handleRefreshItemsTable}/>}
                {currentSection === 'HowToGuide' && <HowToGuide />}
                {currentSection === 'AccountCookies' && <AccountCookies />}
                {currentSection === 'Login' && <Login />}
                {currentSection === 'Contact' ? (
                    user && user.isAdmin ? 
                    <Messages userId={user.id} /> : 
                    <ContactForm />
                ) : null}
            </div>
        </>
    );
  };

export default MainHeaders;