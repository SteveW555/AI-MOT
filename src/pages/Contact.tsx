import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contact Us
          </h1>

          <div className="space-y-8">
            <p className="text-lg text-slate-700">
              Have questions or ready to get started? We'd love to hear from you. Reach out using any of the methods below.
            </p>

            <div className="bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)] rounded-lg p-[4px] shadow-xl">
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Email</h2>
                    <a href="mailto:eric@aimot.ai" className="text-lg text-blue-600 hover:text-blue-700 transition">
                      eric@aimot.ai
                    </a>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Phone</h2>
                    <a href="tel:+447508670556" className="text-lg text-blue-600 hover:text-blue-700 transition">
                      07508 670556
                    </a>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Office Hours</h2>
                    <p className="text-lg text-slate-700">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                    </p>
                    <p className="text-lg text-slate-700">
                      Saturday - Sunday: Closed
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Location</h2>
                    <p className="text-lg text-slate-700">
                      Remote & On-Site Services Available
                    </p>
                    <p className="text-slate-600 mt-2">
                      We serve clients globally through virtual consultations and offer on-site services for select locations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Book Your AI MOT?
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                Fill out our booking form to schedule your personalized AI diagnostic session.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all text-base font-medium"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
