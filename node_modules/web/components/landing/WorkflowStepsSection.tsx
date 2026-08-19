import React from "react";
import { Camera, Sparkles, HardHat } from "lucide-react";

const STEPS = [
  {
    number: "1",
    icon: <Camera className="w-6 h-6" />,
    title: "Capture Space",
    description: "Upload four photos of your existing room. No complex measurements or professional photography required."
  },
  {
    number: "2",
    icon: <Sparkles className="w-6 h-6" />,
    title: "Style AI",
    description: "Select your preferred aesthetic. Our engine generates hyper-realistic renders and curates a precise material moodboard."
  },
  {
    number: "3",
    icon: <HardHat className="w-6 h-6" />,
    title: "Specialist Execution",
    description: "Lock in your design and seamlessly hand off the exact specifications to a verified Kanso partner to begin construction."
  }
];

export function WorkflowStepsSection() {
  return (
    <section className="w-full py-20 sm:py-24 bg-[#f4f0ea]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1b1c19]">
            How Space Becomes Reality
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            A streamlined, three-step journey from imagination to execution, guided by intelligence and crafted by experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-12">
          {STEPS.map((step, index) => (
            <div 
              key={index} 
              className="w-full text-center p-6 flex flex-col items-center bg-[#fbf9f4] border border-[#c4c7c7] rounded-2xl"
            >
              <div className="w-12 h-12 bg-[#f4f0ea] border border-[#c4c7c7] rounded-full flex items-center justify-center mb-4 text-[#1b1c19]">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-[#1b1c19] mt-4">
                {step.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mt-2 max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

