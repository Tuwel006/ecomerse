import React from 'react';

const Card = ({ children, className = '', hover = false, onClick }) => {
    const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-200 cursor-pointer' : '';

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 ${hoverClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`text-gray-600 ${className}`}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
