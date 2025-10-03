import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About AI MOT
          </h1>

          <div className="space-y-6 text-lg text-slate-700">
            <p>
              AI MOT is your trusted partner in navigating the rapidly evolving landscape of artificial intelligence and automation. We specialize in helping businesses and individuals harness the power of AI to streamline operations, boost productivity, and unlock new opportunities.
            </p>

            <p>
              Our team of experienced AI engineers provides personalized consultations to understand your unique challenges and design custom automation solutions tailored to your needs. Whether you're just beginning to explore AI or looking to scale your existing implementations, we're here to guide you every step of the way.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
              What We Do
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3">One-on-one AI consultation sessions</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3">Custom automation workflow design</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3">AI integration and implementation support</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3">Training and ongoing support</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
              Our Approach
            </h2>

            <p>
              We believe in a personalized, hands-on approach to AI consulting. Every business is unique, and cookie-cutter solutions simply don't work. That's why we start with a comprehensive diagnostic session—your AI MOT—to understand your current processes, identify opportunities for improvement, and create a roadmap tailored specifically to your goals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
