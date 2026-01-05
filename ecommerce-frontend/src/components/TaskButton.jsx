import React, { useState, useEffect } from 'react';

const TaskButton = ({ value, targetButtonRef, onTopButtonClick,count,nextLink }) => {
  const [countdown, setCountdown] = useState(count);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else {
      setIsButtonDisabled(false); // Enable button after countdown ends
    }
  }, [countdown]);

  const handleButtonClick = () => {
    if (value === 2 || value === 4) {
        onTopButtonClick(true);
        if (targetButtonRef.current) {
            const rect = targetButtonRef.current.getBoundingClientRect();
            const scrollPosition = rect.top + window.scrollY; // Calculate the position relative to the document
      
            // Scroll to the target button's position
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }
    } else if (value === 1 || value === 3) {
      // Redirect to a specific link
      window.location.href= nextLink; // Replace with your desired URL
    }
    else if(value === 5) {
      const bit = new URLSearchParams(window.location.search).get('bit');
      const tnk = new URLSearchParams(window.location.search).get('tnk');
      window.location.href = `/generate/code?bit=${bit}&tnk=${tnk}`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleButtonClick} 
        disabled={isButtonDisabled} 
        className={`px-4 py-2 text-white ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        {isButtonDisabled ? `Please Wait... ${countdown}` : <p>{(value===1)? `I'm Not a Robot`: (value===2 ||value===4)?`Continue`:(value=== 3)?`Verify`: (value===5)?`Generate Code`:''}</p>}
      </button>
    </div>
  );
};

export default TaskButton;