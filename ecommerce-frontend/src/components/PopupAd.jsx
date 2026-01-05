// src/components/PopupAd.jsx
import React, { useState, useEffect } from 'react';

const PopupAd = ({ adCode, showPopup }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showPopup) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 5000); // Popup disappears after 5 seconds
    }
  }, [showPopup]);

  return (
    <>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="border p-4 bg-white">
            <strong>Popup Ad: </strong> {adCode}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupAd;
