// FullPageAd.js
import React, { useState } from 'react';

const FullPageAd = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full text-center">
        <p className="text-lg font-semibold mb-4">Your Full Page Ad</p>
        <p className="text-sm mb-4">This is a full-page advertisement. Click close to dismiss.</p>
        <button onClick={handleClose} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default FullPageAd;
