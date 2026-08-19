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

export function HowItWorksSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1b1c19] mb-4">
            How It Works
          </h2>
          <p className="max-w-xl mx-auto font-body text-base text-[#1b1c19]/80 leading-relaxed">
            A streamlined, three-step journey from imagination to execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <div 
              key={index} 
              className="bg-[#f4f0ea] border border-[#c4c7c7] rounded-2xl p-8 flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-[#fbf9f4] border border-[#c4c7c7] rounded-full flex items-center justify-center mb-6 relative">
                <div className="text-[#1b1c19]">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1b1c19] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="font-serif text-xl text-[#1b1c19] mb-3">
                {step.title}
              </h3>
              <p className="w-full text-sm leading-relaxed text-[#1b1c19]/70 font-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

