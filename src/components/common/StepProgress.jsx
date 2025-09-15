const StepProgress = ({ currentStep = 1, steps = [], className = '' }) => {
  const justifyClass = steps.length === 2 ? 'justify-center' : 'justify-between';
  
  return (
    <div className={`flex items-center ${justifyClass} mb-8 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index + 1 <= currentStep
                ? 'bg-amber-400 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 text-sm ${
              index + 1 <= currentStep
                ? 'font-semibold'
                : 'text-gray-500'
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgress; 