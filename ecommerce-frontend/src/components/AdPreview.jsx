// src/components/AdPreview.jsx
import React from 'react';

const AdPreview = ({ adCode, location, adType }) => {
  return (
    <div className="border border-gray-400 p-4 mt-4">
      <h2 className="text-lg font-bold mb-2">Ad Preview</h2>

      {/* Header Ad Preview */}
      {location === 'header' && (
        <div className="border p-2 mb-4 bg-gray-100">
          <strong>Header Ad: </strong> {adCode}
        </div>
      )}

      {/* Sidebar Ad Preview */}
      {location === 'sidebar' && (
        <div className="border p-2 mb-4 bg-gray-100">
          <strong>Sidebar Ad: </strong> {adCode}
        </div>
      )}

      {/* Footer Ad Preview */}
      {location === 'footer' && (
        <div className="border p-2 mb-4 bg-gray-100">
          <strong>Footer Ad: </strong> {adCode}
        </div>
      )}

      {/* In-Content Ad Preview */}
      {adType === 'in-content' && (
        <div className="border p-2 mb-4 bg-gray-100">
          <strong>In-Content Ad: </strong> {adCode}
        </div>
      )}

      {/* Popup Ad Preview */}
      {adType === 'popup' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="border p-4 bg-white">
            <strong>Popup Ad: </strong> {adCode}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdPreview;
