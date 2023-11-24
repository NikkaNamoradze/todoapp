import React from 'react';
import ReactDOM from 'react-dom';

const defaultBranding = {
  modal: '#F7F7F7',
};

const Modal = ({ style, visible, children, animation }) => {
  if (!visible) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: defaultBranding.modal,
          borderRadius: '5px',
          width: '40%',
          height: '30%',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

// Place this at the root level of your HTML file
// It will be the mounting point for the modal
const ModalContainer = () => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);

  return null;
};

export { Modal, ModalContainer };
