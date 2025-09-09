import { FileCode, Brain, GitBranch } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: FileCode,
    title: "Full Repository Context",
    description: "GitSage understands your entire repo, not just files in isolation."
  },
  {
    icon: Brain,
    title: "AI-Powered Q&A",
    description: "Ask natural language questions and get precise, code-aware answers."
  },
  {
    icon: GitBranch,
    title: "Smart Scraping",
    description: "Automatically scrape and update repos for fresh insights."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl tracking-tight">
            Built for Modern Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GitSage combines the power of AI with deep repository understanding to transform how you work with code.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-[1.25rem] flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}