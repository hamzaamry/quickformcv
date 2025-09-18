import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackFAQInteraction } from "@/utils/analytics";

export const FAQ = () => {
  const faqs = [
    {
      question: "Is QuickForm CV really free during beta?",
      answer:
          "Yes! During our beta phase, all core features including templates, AI suggestions, and PDF export are completely free. No credit card required.",
    },
    {
      question: "How long will the beta last?",
      answer:
          "Our beta phase is planned to run for several more months. All beta users will receive advance notice before any pricing changes and special early-bird pricing.",
    },
    {
      question: "Is my data secure and private?",
      answer:
          "Absolutely. We use industry-standard encryption and security practices to protect your personal information. Your resume content is never shared, sold, or used for any purpose without your consent. You retain full ownership and control over your data at all times.",
    },
    {
      question: "How does the AI resume builder work?",
      answer:
          "Our AI analyzes your input—such as job history, skills, and target role—to provide smart suggestions for action verbs, achievement statements, and keyword optimization. It helps you craft a compelling, results-driven resume that aligns with industry standards and improves your chances of passing ATS scans.",
    },
    {
      question: "Can I download my resume as PDF?",
      answer:
          "You can export your resume as a high-quality PDF with one click. The PDF maintains all formatting and is ready for job applications.",
    },
    {
      question: "Are my resumes saved automatically?",
      answer:
          "Yes, your work is automatically saved as you type. You can access your resumes from any device by logging into your account.",
    },
  ];

  const handleFAQToggle = (question, isOpen) => {
    trackFAQInteraction(question, isOpen ? 'expand' : 'collapse');
  };

  return (
      <div id="faq" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about QuickForm CV
            </p>
          </div>
          <div className="mt-16">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger
                        onClick={(e) => {
                          // Check if accordion is being opened or closed
                          const isCurrentlyOpen = e.target.getAttribute('data-state') === 'open';
                          handleFAQToggle(faq.question, !isCurrentlyOpen);
                        }}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
  );
};