import React, { CSSProperties } from 'react';

const style: CSSProperties  = {
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  margin: '90px auto',
  position: 'relative',
  borderTop: '3px solid rgba(0, 0, 0, 0.1)',
  borderRight: '3px solid rgba(0, 0, 0, 0.1)',
  borderBottom: '3px solid rgba(0, 0, 0, 0.1)',
  borderLeft: '3px solid #818a91',
  transform: 'translateZ(0)',
  animation: 'loading-spinner 0.5s infinite linear',
};

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner" style={style}>
    <style>
    {`
    @keyframes loading-spinner {
      0% { transform : rotate(0deg); }
      100% { transform : rotate(360deg); }
    }
    `}
    </style>
  </div>
);

export default LoadingSpinner;
