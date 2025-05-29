import React from 'react';

function Username({ username }) {
  if (!username) return null;
  
  return (
    <span className='text-green-600 font-bold'>Welcome, {username}</span>
  );
}

export default Username; 