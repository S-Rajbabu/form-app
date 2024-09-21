import React, { useState } from 'react';
import '../Sidebar.css'; // CSS for the toggle switch

const Sidebar = ({ onWelcomeScreenChange, onEmailEdit, setActiveContent }) => {
    const [showModal, setShowModal] = useState(false);
    const [steps, setSteps] = useState([]); // Store dynamically added steps
    const [activeTab, setActiveTab] = useState('Content');
    const [editingWelcomeScreen, setEditingWelcomeScreen] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false); // State for email editing
    const [emailData, setEmailData] = useState({ title: '', description: '', required: false }); // State for email data
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePosition, setImagePosition] = useState('left'); // Default image position

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // addfied email part
    const handleFieldSelection = (fieldType) => {
        if (fieldType === 'Email') {
            const newEmailStep = { id: Date.now(), type: fieldType }; // Create new step
            setSteps((prevSteps) => [...prevSteps, newEmailStep]); // Add it to steps
            setEditingEmail(true); // Enable email editing mode
            onEmailEdit({
                title: 'Your Email Title',
                description: 'Your Email Description',
                required: true,
            });

        } else {
            setSteps((prevSteps) => [...prevSteps, { id: Date.now(), type: fieldType }]);
        }
        closeModal(); // Close modal after selection
    };

// Add this inside the Sidebar component
const handleEmailClick = (step) => {
    setEmailData({ title: step.title || '', description: step.description || '', required: step.required || false });
    setEditingEmail(true);
    onWelcomeScreenChange({ email: { title: step.title, description: step.description, required: step.required } }); // Show email content in main
};

// Update the existing email step handling
const handleEditEmail = (step) => {
    handleEmailClick(step);
    setActiveContent('email');
};

    const handleDelete = (id) => {
        setSteps((prevSteps) => prevSteps.filter(step => step.id !== id));
    };


    // Drag  Functionality
    const handleDrag = (event, index) => {
        event.dataTransfer.setData('dragIndex', index);
    };

    // Drop Functionality
    const handleDrop = (event, dropIndex) => {
        const dragIndex = event.dataTransfer.getData('dragIndex');
        if (dragIndex !== undefined && dragIndex !== null) {
            const updatedSteps = [...steps];
            const draggedItem = updatedSteps.splice(dragIndex, 1)[0];
            updatedSteps.splice(dropIndex, 0, draggedItem);
            setSteps(updatedSteps);
        }
    };

    const handleWelcomeScreenClick = () => {
        setEditingWelcomeScreen(true); // Enable editing for Welcome screen
        onWelcomeScreenChange(true); // Notify parent component
        setActiveContent('welcome');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                onWelcomeScreenChange({ image: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        onWelcomeScreenChange({ image: null });
    };

    const handleEmailSave = () => {
        setEditingEmail(false); // Revert sidebar to default state
        onWelcomeScreenChange({ email: emailData }); // Update email data in parent
        const updatedSteps = steps.map(step =>
            step.type === 'Email' ? { ...step, ...emailData } : step
        );
        setSteps(updatedSteps);
        setActiveContent('welcome');
    };

    const handleEmailDiscard = () => {
        setEditingEmail(false); // Revert sidebar to default state
        setActiveContent('welcome'); // Switch back to welcome screen
    };

    const handleEmailChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmailData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = () => {
        setEditingWelcomeScreen(false); // Revert sidebar to default state
    };

    const handleDiscard = () => {
        setEditingWelcomeScreen(false); // Revert sidebar to default state
    };

    return (
        <div className="sidebar">
            {editingWelcomeScreen ? (
                // Welcome screen editing section
                <div className="welcome-edit-section">
                    <h3>Edit Welcome Screen</h3>
                    <label>Title</label>
                    <input type="text" onChange={(e) => onWelcomeScreenChange({ title: e.target.value })} />
                    <br /><label>Description</label>
                    <textarea onChange={(e) => onWelcomeScreenChange({ description: e.target.value })}></textarea>
                    <br /><label>Button Text</label>
                    <input type="text" onChange={(e) => onWelcomeScreenChange({ buttonText: e.target.value })} />
                    <br /><label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} /> {/* Allow all image types */}

                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" style={{ textAlign: imagePosition }} />
                            <button onClick={handleRemoveImage}>Remove Image</button>
                            
                            {/* Image position buttons */}
                            <div className="image-controls">
                                <span className="label">Placement</span>
                                <button onClick={() => {
                                    setImagePosition('left');
                                    onWelcomeScreenChange({ imagePosition: 'left' });
                                }}>Left</button>

                                <button onClick={() => {
                                    setImagePosition('right');
                                    onWelcomeScreenChange({ imagePosition: 'right' });
                                }}>Right</button>
                            </div>


                        </div>
                    )}
                    <button onClick={handleSave} className="save-button">Save</button>
                    <button onClick={handleDiscard} className="discard-button">Discard</button>
                </div>

            ) : editingEmail ? (
                // Email field editing section
                <div className="email-edit-section">
                    <h3>Edit Email Screen </h3>
                    <label>Title</label>
                    <input type="text" name="title" value={emailData.title} onChange={handleEmailChange} />
                    <br /><label>Description</label>
                    <textarea name="description" value={emailData.description} onChange={handleEmailChange}></textarea>
                    <br />
                    <label>Required</label>
                    <label className="switch">
                        <input type="checkbox" name="required" checked={emailData.required} onChange={handleEmailChange} />
                        <span className="slider round"></span>
                    </label>
                    <br /><button onClick={handleEmailSave}>Save</button>
                    <button onClick={handleEmailDiscard} className="delete-button" >Discard</button>
                </div>
            ) : (
                // Default sidebar view
                <>
                    <div className="navbar">
                        <ul className="navbar-menu">
                            <li className={activeTab === 'Content' ? 'active' : ''} onClick={() => setActiveTab('Content')}>Content</li>
                            <li className={activeTab === 'Design' ? 'active' : ''} onClick={() => setActiveTab('Design')}>Design</li>
                            <li className={activeTab === 'Share' ? 'active' : ''} onClick={() => setActiveTab('Share')}>Share</li>
                            <li className={activeTab === 'Replies' ? 'active' : ''} onClick={() => setActiveTab('Replies')}>Replies</li>
                        </ul>
                    </div>

                    <h5>Steps</h5>
                    <h6>The steps users will take to complete the form</h6>
                    <div className="steps">
                        <button className="step-button" onClick={handleWelcomeScreenClick}>Welcome screen</button>
                       
                        {steps.map((step, index) => (
                            <div key={step.id} draggable onDragStart={(event) => handleDrag(event, index)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index)} className="draggable-step">
                                <div className="step-container">
                                    <button className="step-button" onClick={() => step.type === 'Email' ? handleEditEmail(step) : null}>{step.type}</button>
                                    <button className="delete-btn" onClick={() => handleDelete(step.id)}>✖</button>
                                </div>
                            </div>
                        ))}

                        <button className="add-field-button" onClick={openModal}>+ Add field</button>
                        <button className="step-button">End screen</button>

                        {showModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <button className="close-btn" onClick={closeModal}>×</button>
                                    <h3>+ Add field</h3>
                                    <div className="field-options">
                                        <button onClick={() => handleFieldSelection('Multiple Choice')}>Multiple Choice</button>
                                        <button onClick={() => handleFieldSelection('Short Text')}>Short Text</button>
                                        <button onClick={() => handleFieldSelection('Email')}>Email</button>
                                        <button onClick={() => handleFieldSelection('Dropdown')}>Dropdown</button>
                                        <button onClick={() => handleFieldSelection('Phone Number')}>Phone Number</button>
                                        <button onClick={() => handleFieldSelection('Section')}>Section</button>
                                        <button onClick={() => handleFieldSelection('Contact Information')}>Contact Information</button>
                                        <button onClick={() => handleFieldSelection('Legal')}>Legal</button>
                                        <button onClick={() => handleFieldSelection('Country')}>Country</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="save-delete-buttons">
                        <button className="save-button">Save & Publish</button>
                        <button className="delete-button">Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
