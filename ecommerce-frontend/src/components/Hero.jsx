import React from 'react';

const Hero = () => {
  return (
    <div className="hover:scale-110 ease-in duration-500 hover:mt-[20px] w-screen h-96 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center p-6">
      <div className="text-center space-y-6 md:space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">Discover Our Stories</h1>
        <p className="text-lg md:text-2xl text-gray-700">Dive into the world of insights and inspirations</p>
        <button className="mt-4 px-6 py-3 bg-yellow-500 text-gray-800 rounded-full shadow-xl hover:bg-yellow-400 hover:scale-105 transition-all">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
