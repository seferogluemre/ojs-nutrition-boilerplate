import { Award, Shield, Truck } from "lucide-react";
import { Benefit } from "../../types";

export function ProductBenefits() {
  const getBenefitIcon = (iconName: string) => {
    const icons = {
      truck: Truck,
      shield: Shield,
      award: Award,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Truck;
    return <IconComponent className="w-6 h-6" />;
  };

  const benefits: Benefit[] = [
    { icon: "truck", title: "Ücretsiz Kargo", description: "250 TL üzeri" },
    { icon: "shield", title: "Güvenli Ödeme", description: "SSL sertifikası" },
    { icon: "award", title: "Kalite Garantisi", description: "100% orjinal" }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 pt-2">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center">
          <div className="flex justify-center mb-2 text-gray-600 dark:text-gray-400">
            {getBenefitIcon(benefit.icon)}
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {benefit.title}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {benefit.description}
          </div>
        </div>
      ))}
    </div>
  );
} 