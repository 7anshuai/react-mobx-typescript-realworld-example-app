import React from 'react';

const wrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const errorStyle  = {
  display: 'inline-block',
  margin: '20px auto',
  borderRadius: '4px',
  padding: '8px 15px',
  color: 'rgb(240, 45, 45)',
  // fontWeight: 'bold',
  backgroundColor: 'rgba(240, 45, 45, 0.1)'
};

type Props = {
  message: string
}

const RedError: React.FC<Props> = props => {
  return (
    <div style={wrapperStyle}>
      <div style={errorStyle}>
        {props.message}
      </div>
    </div>
  );
};

export default RedError;
