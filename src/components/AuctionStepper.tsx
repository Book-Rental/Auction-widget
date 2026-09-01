import React from "react";

interface AuctionStepperProps {
  currentStep: number;
}

const steps = [
  "Book Details",
  "Auction Details",
  "Review",
  "Publish",
];

const AuctionStepper: React.FC<AuctionStepperProps> = ({
  currentStep,
}) => {
  return (
    <div className="mb-8 flex w-full items-start">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex min-w-[90px] flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  isActive || isCompleted
                    ? "bg-[#6841D8] text-white"
                    : "border border-gray-300 bg-white text-gray-500"
                }`}
              >
                {stepNumber}
              </div>

              <span
                className={`mt-2 text-[10px] font-medium ${
                  isActive
                    ? "text-[#6841D8]"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mt-3 h-px flex-1 ${
                  stepNumber < currentStep
                    ? "bg-[#6841D8]"
                    : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AuctionStepper;