import React from 'react'

const MembershipCard = () => {
  const membershipCardImage = "/images/membership_card.png";

  const handleSeeMore = () => {
    console.log('See more details clicked');
    // Add your logic here
  };

  const handleSignIn = () => {
    console.log('Sign in clicked');
    // Add your sign in logic here
  };

  const handleBecomeMember = () => {
    console.log('Become a member clicked');
    // Add your membership logic here
  };

  return (
    <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg border border-neutral-lighter overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Membership Card */}
        <div className="lg:w-1/3 p-[18px] flex items-center justify-center">
          <img
            src={membershipCardImage}
            alt="Travel with Gaston Membership Card"
            className="w-full max-w-sm rounded-2xl shadow-lg"
          />
        </div>

        {/* Right side - Content */}
        <div className="lg:w-2/3 p-[18px] flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="font-heading text-[27px] text-neutral-darkest mb-4 leading-tight">
              Unlock Your Journey: Choose Your Membership
            </h1>

            <p className="text-sm text-neutral-light mb-0 leading-relaxed">
              Gain access to exclusive member-only rates, priority upgrades, and flexible booking options.
            </p>

            <p className="text-sm text-neutral-light mb-2 leading-relaxed">
              Select a membership plan to enhance every aspect of your travel.
            </p>

            <button 
              className="text-primary text-sm font-medium hover:text-primary-dark transition-colors mb-4"
              onClick={handleSeeMore}
            >
              See more details
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <p className="text-neutral-DEFAULT text-xs">
                Already a member? 
                <button 
                  className="ml-1 text-neutral-darkest font-medium hover:text-neutral-dark transition-colors underline"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </p>

              <button 
                className="bg-neutral-darkest hover:bg-neutral-dark text-white px-8 py-3 text-base font-medium rounded-lg transition-colors"
                onClick={handleBecomeMember}
              >
                Become a member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
