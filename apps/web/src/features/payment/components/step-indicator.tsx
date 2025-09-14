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
          <div className="flex items-center space-x-4 py-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold relative z-10 transition-all duration-300 ${
                step.completed
                  ? "bg-green-500 text-white shadow-md"
                  : currentStep === step.number
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                    : "bg-gray-300 dark:bg-neutral-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {step.completed ? <Check className="h-5 w-5" /> : step.number}
            </div>
            <span
              className={`text-xl font-semibold transition-colors duration-300 ${
                currentStep === step.number
                  ? "text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
          
          {/* Connecting line between steps */}
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-[4.5rem] transform -translate-x-0.5">
              {/* Background line */}
              <div className="w-0.5 h-14 bg-gray-200 dark:bg-neutral-800" />
              {/* Animated fill line */}
              <div 
                className={`absolute top-0 left-0 w-0.5 transition-all duration-500 ease-in-out ${
                  step.completed
                    ? "bg-green-500 h-14"
                    : currentStep === step.number
                      ? "bg-black dark:bg-white h-7"
                      : "bg-gray-300 dark:bg-neutral-700 h-0"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
