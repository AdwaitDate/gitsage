import { Github, Database, MessageSquare, ArrowRight, Clock, Users } from "lucide-react";
import { Card } from "./ui/card";

const steps = [
  {
    icon: Github,
    title: "Connect GitHub",
    description: "Link your repositories with one click. Supports public and private repos with full security.",
    step: "01"
  },
  {
    icon: Database,
    title: "Index & Embed",
    description: "Your code is vectorized and prepared for RAG-powered queries in minutes.",
    step: "02"
  },
  {
    icon: MessageSquare,
    title: "Ask & Discover",
    description: "Get accurate, context-aware responses from your repo instantly.",
    step: "03"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with GitSage in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative mb-16">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-30"></div>
              <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute top-1/2 left-2/3 transform -translate-y-1/2">
                <ArrowRight className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center space-y-6 group">
              <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-medium text-primary">{step.step}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dashboard Demo */}
        <div className="max-w-4xl mx-auto mt-20">
          <Card className="relative rounded-[1.25rem] overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card to-card/50">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-medium mb-2">Ready to transform your workflow?</h4>
                  <p className="text-muted-foreground">Join thousands of developers using GitSage</p>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[1rem] p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Setup Time</span>
                  </div>
                  <div className="text-2xl font-medium text-primary">2min</div>
                </div>
                
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-[1rem] p-4 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-xs text-muted-foreground">Satisfaction</span>
                  </div>
                  <div className="text-2xl font-medium text-accent">99%</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-[1rem] p-4 border border-green-500/20">
                  <div className="text-xs text-muted-foreground mb-2">Avg Response</div>
                  <div className="text-2xl font-medium text-green-500">1.8s</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-[1rem] p-4 border border-purple-500/20">
                  <div className="text-xs text-muted-foreground mb-2">Accuracy</div>
                  <div className="text-2xl font-medium text-purple-500">98.5%</div>
                </div>
              </div>
              
              {/* Progress Bar Demo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Repository Analysis Progress</span>
                  <span className="text-primary">87%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent w-[87%] rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}