import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
    const [welcomeScreenData, setWelcomeScreenData] = useState({
        title: 'Welcome to our form',
        description: 'This is a description of the form',
        buttonText: 'Start',
        email: { title: '', description: '', required: false }
    });
    const [activeContent, setActiveContent] = useState('welcome');

    const handleWelcomeScreenChange = (newData) => {
        setWelcomeScreenData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const handleEmailEdit = (emailData) => {
        setWelcomeScreenData((prevData) => ({
            ...prevData,
            email: emailData,
        }));
        setActiveContent('email'); // Switch to email content
    };

    return (
        <div className="App">
            <div className="app-body">
                <Sidebar 
                    onWelcomeScreenChange={handleWelcomeScreenChange} 
                    onEmailEdit={handleEmailEdit}
                    setActiveContent={setActiveContent} 
                />
                <MainContent
                    welcomeScreenData={welcomeScreenData}
                    activeContent={activeContent} // Pass active content state
                />
            </div>
        </div>
    );
}

export default App;
