import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#components/ui/accordion";
import { ProductExplanation } from "../../types";

export function ProductDetails({ explanation }: { explanation: ProductExplanation }) {
  console.log("explanation", explanation);
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger className="text-lg font-semibold">
            ÖZELLİKLER
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                {explanation.description}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nutrition">
          <AccordionTrigger className="text-lg font-semibold">
            BESİN İÇERİĞİ
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            <div className="space-y-6">
              <div className="whitespace-pre-line">
                {explanation.features}
              </div>

              {explanation.nutritional_content?.ingredients && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">İÇİNDEKİLER</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    {explanation.nutritional_content.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient.value}</li>
                    ))}
                  </ul>
                </div>
              )}

              {explanation.nutritional_content?.nutrition_facts && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">BESİN DEĞERLERİ</h4>
                  {explanation.nutritional_content.nutrition_facts.portion_sizes && (
                    <p className="text-sm text-gray-600 mb-3">
                      {explanation.nutritional_content.nutrition_facts.portion_sizes.join(", ")} için
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    {explanation.nutritional_content.nutrition_facts.ingredients?.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-600">
                          {ingredient.amounts.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usage">
          <AccordionTrigger className="text-lg font-semibold">
            KULLANIM ŞEKLİ
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed">
            <p>
              {explanation.usage}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 