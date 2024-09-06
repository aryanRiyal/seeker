import React from 'react';

const ResumeModal = ({ imageURL, onClose }) => {
    return (
        <>
            <div className='resume-modal'>
                <div className='modal-content'>
                    <span className='close' onClick={onClose}>
                        &times;
                    </span>
                    <img src={imageURL} alt='resume' />
                </div>
            </div>
        </>
    );
};

export default ResumeModal;
