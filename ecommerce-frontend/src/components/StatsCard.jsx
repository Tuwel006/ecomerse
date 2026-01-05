import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    const trendColorClasses = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </p>

                    {trend && trendValue && (
                        <div className="mt-2 flex items-center text-sm">
                            {trend === 'up' && (
                                <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H13a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {trend === 'down' && (
                                <svg className="w-4 h-4 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h4a1 1 0 001-1v-4a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H13a1 1 0 00-1 1z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className={trendColorClasses[trend]}>
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
