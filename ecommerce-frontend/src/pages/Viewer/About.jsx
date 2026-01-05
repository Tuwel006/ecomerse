import React from 'react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container-wide mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Techcentry</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sharing technology insights, web development tutorials, and industry trends for developers worldwide.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="container-wide mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">My Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                I'm passionate about making technology accessible to everyone. Through Techcentry, I share practical tutorials, industry insights, and development best practices to help fellow developers grow their skills and stay current with emerging technologies.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                As a full-stack developer with expertise in React, Node.js, and modern web technologies, I focus on creating content that bridges the gap between complex technical concepts and real-world applications. My goal is to build a community where developers can learn, share, and innovate together.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💻</div>
                <span className="text-gray-600 font-medium">Building the Future with Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="container-wide mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The person behind Techcentry and the content you read.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">TS</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tuwel Shaikh</h3>
              <p className="text-blue-600 font-medium mb-4">Full-Stack Developer & Tech Writer</p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Passionate about web development, AI, and emerging technologies. I love building scalable applications and sharing knowledge through detailed tutorials and insights. When I'm not coding, you'll find me exploring new frameworks or contributing to open-source projects.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="https://github.com/tuwel006" className="text-gray-400 hover:text-blue-600">GitHub</a>
                <a href="https://linkedin.com/in/tuwel-shaikh-22a4a3248" className="text-gray-400 hover:text-blue-600">LinkedIn</a>
                <a href="mailto:tuwelshaikh006@gmail.com" className="text-gray-400 hover:text-blue-600">Email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
