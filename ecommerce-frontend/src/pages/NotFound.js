import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - DSM Kart</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 9 6 6"/>
              <path d="m15 9-6 6"/>
            </svg>
          </div>
          
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-container {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .not-found-content {
          text-align: center;
          max-width: 500px;
          padding: 3rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .not-found-icon {
          color: #64748b;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .not-found-title {
          font-size: 4rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          line-height: 1;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .not-found-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: #334155;
          margin: 0 0 1rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .not-found-description {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .btn-primary {
          background-color: #1e293b;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0f172a;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background-color: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .not-found-container {
            padding: 1rem;
          }

          .not-found-content {
            padding: 2rem 1.5rem;
          }

          .not-found-title {
            font-size: 3rem;
          }

          .not-found-subtitle {
            font-size: 1.25rem;
          }

          .not-found-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default NotFound;