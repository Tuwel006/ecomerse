import React, { useEffect, useState, useCallback } from 'react';

const Code = () => {
  const [code, setCode] = useState('');
  const [bit, setBit] = useState(null);
  const [tnk, setTnk ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false); 

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  const generateHash = useCallback(async (input) => {
    const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
  },[]);
  
  const generateRandomCode = useCallback( async () => {
    // Step 1: Extract bit and tnk from the URL
    const bit = new URLSearchParams(window.location.search).get('bit'); // Default to '00' if not found
    const tnk = new URLSearchParams(window.location.search).get('tnk');
    setBit(bit);
    setTnk(tnk);

    // Step 3: Get the current date
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Step 4: Combine the variables into a single string
    const combinedString = `${bit}-${tnk}-${formattedDate}`;

    // Step 5: Generate the hash
    const hash = await generateHash(combinedString);

    // Step 6: Format the code (taking first 10 characters from the hash)
    const code = hash.substring(0, 10).toUpperCase();

    return code;
  },[generateHash]);

  

  useEffect(() => {
    const fetchCode = async () => {
      setIsLoading(true); // Show loading state
      const generatedCode = await generateRandomCode(); // Wait for the code to generate
      setCode(generatedCode); // Store the generated code in state
      setIsLoading(false); // Hide loading state
    };

    fetchCode();
  }, [generateRandomCode]);

  return ( (bit&&tnk)?
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-500">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-gray-600 mb-6">You got the unique code:</p>
        {isLoading ? (
          <div className="text-gray-500">Generating code...</div>
        ) : (
          <div className="bg-green-100 text-green-800 text-lg font-semibold py-2 px-4 rounded-md">
            {code}
          </div>
        )}
        <p className="mt-4 text-gray-500">Keep it safe and enjoy your reward!</p>
        <button
          onClick={handleCopy}
          className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          {isCopied ? 'Copied!' : 'Claim Your Reward'}
        </button>
      </div>
    </div>
    :'Code Not Found'
  );
};

export default Code;
