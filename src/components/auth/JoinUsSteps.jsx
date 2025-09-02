import { useState } from 'react';
import StepProgress from '../common/StepProgress';
import JoinUsForm from './JoinUsForm';
import ChooseYourPlan from './ChooseYourPlan';

const JoinUsSteps = ({ onSwitchToSignIn, onRegistrationSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState(null);

  const steps = [
    'Your details',
    'Payment details'
  ];

  const handleStepComplete = (stepData) => {
    if (stepData.step === 'details' && stepData.completed) {
      setUserData(stepData.userData);
      // Ya no necesitamos avanzar al paso 2 (Choose your plan)
      // El formulario ahora redirige directamente a /checkout
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JoinUsForm 
            onSwitchToSignIn={onSwitchToSignIn}
            onStepComplete={handleStepComplete}
            onRegistrationSuccess={onRegistrationSuccess}
          />
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