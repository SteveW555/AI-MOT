import React from 'react';
import { Modal } from './ui/modal';

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ open, onClose }) => {
  const pricingTiers = [
    {
      name: 'Free',
      tagline: 'Try before you commit',
      price: '$0/month',
      features: [
        'AI overview consultation (30 min)',
        'Community support',
        'Basic documentation',
        'Monthly newsletter',
        'Access to webinars'
      ],
      cta: 'Get Started',
      isPopular: false
    },
    {
      name: 'Basic',
      tagline: 'Perfect for individuals getting started',
      price: '$49/month',
      features: [
        'AI consultation (1 hour/month)',
        'Email support',
        'Basic automation setup',
        'Documentation access',
        'Community forum access'
      ],
      cta: 'Get Started',
      isPopular: false
    },
    {
      name: 'Professional',
      tagline: 'Ideal for growing businesses',
      price: '$149/month',
      features: [
        'AI consultation (4 hours/month)',
        'Priority email & chat support',
        'Advanced automation workflows',
        'Custom AI integration',
        'Monthly strategy sessions',
        'API access'
      ],
      cta: 'Get Started',
      isPopular: true
    },
    {
      name: 'Enterprise',
      tagline: 'For large-scale operations',
      price: 'Custom',
      priceSubtext: 'Contact us',
      features: [
        'Unlimited AI consultation',
        '24/7 dedicated support',
        'Enterprise automation suite',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option'
      ],
      cta: 'Contact Sales',
      isPopular: false
    }
  ];

  return (
    <Modal open={open} onClose={onClose} title="Pricing Plans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)] p-[3px] rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg h-full flex flex-col">
              {tier.isPopular && (
                <div className="flex justify-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {tier.tagline}
                </p>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-slate-900">
                  {tier.price}
                </div>
                {tier.priceSubtext && (
                  <p className="text-sm text-slate-600 mt-1">
                    {tier.priceSubtext}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-700 text-sm ml-3">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`
                  w-full px-6 py-3 rounded-md font-medium transition-all
                  ${tier.isPopular
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PricingModal;
