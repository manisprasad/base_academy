import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQProps {
  questions: FAQItem[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const FAQ: React.FC<FAQProps> = ({
  questions,
  className = "",
  itemClassName = "",
  triggerClassName = "",
  contentClassName = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Accordion type="single" collapsible className="w-full">
        {questions.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className={`border-b border-gray-200 dark:border-gray-700 ${itemClassName}`}
          >
            <AccordionTrigger
              className={`text-left font-medium text-gray-900 dark:text-gray-100 ${triggerClassName}`}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className={`text-gray-600 dark:text-gray-300 ${contentClassName}`}
            >
              {typeof item.answer === "string" ? (
                <p className="pt-2">{item.answer}</p>
              ) : (
                item.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
