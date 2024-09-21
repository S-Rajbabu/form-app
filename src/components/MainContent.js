import React from 'react';
import '../App.css';

const MainContent = ({ welcomeScreenData, activeContent }) => {
    return (
        <div className="main-content">
            {activeContent === 'welcome' ? (
                <div className="form-content">
                    <h1>{welcomeScreenData.title || 'Welcome to our form'}</h1>
                    <p>{welcomeScreenData.description || 'This is a description of the form'}</p>
                    {welcomeScreenData.image && (
                        <img
                        src={URL.createObjectURL(welcomeScreenData.image)}
                        alt="Uploaded"
                        style={{
                            float: welcomeScreenData.imagePosition === 'left' ? 'left' : 'right',
                            marginLeft: welcomeScreenData.imagePosition === 'right' ? 'auto' : '0',
                            marginRight: welcomeScreenData.imagePosition === 'left' ? 'auto' : '0',
                        }}
                    />
                    )}
                    <button className="start-btn">{welcomeScreenData.buttonText || 'Start'}</button>
                </div>
                
            ) : activeContent === 'email' ? (
                <div className="email-content">
                    {/* <h2>Email Preview</h2> */}
                    <h3>{welcomeScreenData.email.title || 'Email Title'}</h3>
                    <p>{welcomeScreenData.email.description || 'Email Description'}</p>
                    <p>{welcomeScreenData.email.required ? "This field is required." : "This field is optional."}</p>
                </div>
            ) : null}
        </div>
    );
};

export default MainContent;
