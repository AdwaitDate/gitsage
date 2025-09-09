import { Github, Database, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Github,
    title: "Connect GitHub",
    description: "Link your repositories with one click.",
    step: "01"
  },
  {
    icon: Database,
    title: "Index & Embed",
    description: "Your code is vectorized and prepared for RAG-powered queries.",
    step: "02"
  },
  {
    icon: MessageSquare,
    title: "Ask & Discover",
    description: "Get accurate, context-aware responses from your repo.",
    step: "03"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with GitSage in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center space-y-6">
              <div className="relative mx-auto w-20 h-20 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-lg">
                <step.icon className="w-10 h-10 text-primary-foreground" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm text-accent-foreground">{step.step}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl">{step.title}</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}