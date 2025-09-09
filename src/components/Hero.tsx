import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-6 pt-20">
      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl tracking-tight">
              AI-Powered Insights for Your{" "}
              <span className="text-primary">GitHub Repos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              GitSage analyzes entire repositories with LLMs to give you instant answers, insights, and documentation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-[1.25rem] px-8 py-6 text-lg">
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-[1.25rem] px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Demo
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative rounded-[1.25rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1756908992154-c8a89f5e517f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwQUklMjB0ZWNobm9sb2d5JTIwbmV0d29ya3xlbnwxfHx8fDE3NTczMTY1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="AI-powered code analysis visualization"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}