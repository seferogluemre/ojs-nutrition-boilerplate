import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { number: 1, title: "Adres", completed: currentStep > 1 },
    { number: 2, title: "Kargo", completed: currentStep > 2 },
    { number: 3, title: "Ödeme", completed: false },
  ];
  
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          <div className="flex items-center space-x-3 py-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium relative z-10 ${
                step.completed
                  ? "bg-green-500 text-white"
                  : currentStep === step.number
                    ? "bg-black text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.completed ? <Check className="h-4 w-4" /> : step.number}
            </div>
            <span
              className={`text-lg font-medium ${currentStep === step.number ? "text-black" : "text-gray-400"}`}
            >
              {step.title}
            </span>
          </div>
          
          {/* Connecting line between steps */}
          {index < steps.length - 1 && (
            <div 
              className={`absolute left-4 top-12 w-0.5 h-8 transform -translate-x-0.5 ${
                step.completed
                  ? "bg-green-500"
                  : currentStep === step.number
                    ? "bg-black"
                    : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
