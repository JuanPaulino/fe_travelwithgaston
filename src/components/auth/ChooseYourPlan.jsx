import { useState } from 'react';

const ChooseYourPlan = ({ userData, onBack, onStepComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const plans = [
    {
      id: 'travel',
      name: 'Travel',
      price: 400,
      description: 'Annual fee group membership',
      benefits: [
        'Lowest rates guaranteed',
        'Complimentary benefits',
        'Hotel upgrades',
        'Flexible rates',
        'Booking fee',
        'Lifestyle offers'
      ],
      buttonText: 'Choose Travel Plan',
      buttonColor: 'bg-neutral-darker hover:bg-neutral-darkest text-neutral-white'
    },
    {
      id: 'dynasty',
      name: 'Dynasty',
      price: 1800,
      description: 'Annual fee group membership',
      benefits: [
        'All Travel plan benefits',
        'Lifestyle concierge',
        '24/7 support',
        'Travel planning',
        'Events & access'
      ],
      buttonText: 'Join Dynasty',
      buttonColor: 'bg-primary hover:bg-primary-dark text-neutral-white'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan && onStepComplete) {
      onStepComplete({
        step: 'plan',
        completed: true,
        selectedPlan: selectedPlan
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Currency Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-dark">Currency</span>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="outline-none appearance-none px-3 py-1 pr-8 text-sm font-semibold text-primary"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary font-semibold">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>


              {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 transition-all hover:bg-primary-lightest flex flex-col h-full"
            >
              {/* Plan Image Placeholder */}
              <div className="w-full h-32 bg-neutral-light rounded-lg mb-4 flex items-center justify-center">
                <span className="text-neutral text-sm">Plan Image</span>
              </div>

              {/* Plan Header */}
              <div className="mb-4">
                <p className="text-h5 font-heading font-bold text-neutral-darkest mb-2">{plan.name}</p>
                <div className="text-h4 font-heading font-bold text-neutral-darkest mb-1">
                  ${plan.price.toLocaleString()}.00 per year
                </div>
                <p className="text-xs text-neutral-dark font-body">{plan.description}</p>
              </div>

              {/* Benefits List */}
              <div className="space-y-2 mb-4 flex-grow">
                {plan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-secondary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-neutral-dark font-body">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* See More Details Link */}
              <div className="mb-4">
                <a href="#" className="text-primary-dark hover:text-primary-darker text-base font-medium font-body">
                  See more details
                </a>
              </div>

              {/* Plan Selection Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-4 rounded-md font-medium text-sm transition-colors font-body mt-auto ${plan.buttonColor}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ChooseYourPlan; 