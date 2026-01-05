// src/pages/Author/AdSettings.jsx
import React, { useState } from 'react';
import AdPreview from '../../components/AdPreview';
import PopupAd from '../../components/PopupAd';

const AdSettings = () => {
  const [location, setLocation] = useState('header');
  const [adType, setAdType] = useState('header');
  const [adCode, setAdCode] = useState('');
  const [ads, setAds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleSaveAd = () => {
    if (adCode) {
      setAds([...ads, { location, adType, adCode }]);
      setAdCode('');
    }
  };

  const handleRemoveAd = (index) => {
    setAds(ads.filter((_, i) => i !== index));
  };

  const triggerPopupAd = () => {
    setShowPopup(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ad Settings</h1>

      <div className="mb-4">
        <label className="block font-bold mb-2">Ad Type</label>
        <select
          value={adType}
          onChange={(e) => setAdType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="header">Header</option>
          <option value="sidebar">Sidebar</option>
          <option value="footer">Footer</option>
          <option value="in-content">In-Content</option>
          <option value="popup">Popup</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2">Ad Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="header">Header</option>
          <option value="sidebar">Sidebar</option>
          <option value="footer">Footer</option>
          <option value="in-content">In-Content</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2">Ad Code</label>
        <textarea
          value={adCode}
          onChange={(e) => setAdCode(e.target.value)}
          placeholder="Enter your ad code here..."
          className="border p-2 w-full h-24"
        />
      </div>

      <button
        onClick={handleSaveAd}
        className="bg-blue-500 text-white p-2 mb-4"
      >
        Save Ad
      </button>

      <h2 className="text-xl font-bold mt-8 mb-4">Saved Ads</h2>
      {ads.map((ad, index) => (
        <div key={index} className="border p-4 mb-4">
          <p>
            <strong>Location:</strong> {ad.location}
          </p>
          <p>
            <strong>Type:</strong> {ad.adType}
          </p>
          <p>
            <strong>Code:</strong> {ad.adCode}
          </p>
          <button
            onClick={() => handleRemoveAd(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Live Preview */}
      <AdPreview adCode={adCode} location={location} adType={adType} />

      {/* Popup Ad Preview */}
      {adType === 'popup' && <PopupAd adCode={adCode} showPopup={showPopup} />}
      {adType === 'popup' && (
        <button
          onClick={triggerPopupAd}
          className="bg-green-500 text-white p-2 mt-4"
        >
          Show Popup Ad
        </button>
      )}
    </div>
  );
};

export default AdSettings;
