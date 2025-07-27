import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { number: 1, title: "Adres", completed: currentStep > 1 },
    { number: 2, title: "Kargo", completed: currentStep > 2 },
    { number: 3, title: "Ödeme", completed: false },
  ]

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.completed
                ? "bg-green-500 text-white"
                : currentStep === step.number
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-600"
            }`}
          >
            {step.completed ? <Check className="w-4 h-4" /> : step.number}
          </div>
          <span className={`text-lg font-medium ${currentStep === step.number ? "text-black" : "text-gray-400"}`}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}