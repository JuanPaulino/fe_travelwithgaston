import { useState } from 'react';
import StepProgress from '../common/StepProgress';
import JoinUsForm from './JoinUsForm';
import ChooseYourPlan from './ChooseYourPlan';

const JoinUsSteps = ({ onSwitchToSignIn }) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [userData, setUserData] = useState(null);

  const steps = [
    'Your details',
    'Choose your plan', 
    'Payment details'
  ];

  const handleStepComplete = (stepData) => {
    if (stepData.step === 'details' && stepData.completed) {
      setUserData(stepData.userData);
      setCurrentStep(2);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JoinUsForm 
            onSwitchToSignIn={onSwitchToSignIn}
            onStepComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <ChooseYourPlan 
            userData={userData}
            onBack={() => setCurrentStep(1)}
            onStepComplete={(stepData) => {
              if (stepData.completed) {
                setCurrentStep(3);
              }
            }}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment details</h2>
            <p className="text-gray-600">Componente de pago - pendiente de implementar</p>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Volver
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <StepProgress 
        currentStep={currentStep}
        steps={steps}
      />
      
      {/* Current step content */}
      {renderCurrentStep()}
    </div>
  );
};

export default JoinUsSteps; 