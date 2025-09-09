import { Button } from "./ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-primary to-accent">
      <div className="container mx-auto max-w-7xl text-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl tracking-tight text-primary-foreground">
            Bring AI-Powered Insight to Your Repos
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of developers who are already using GitSage to understand their code better and build faster.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="rounded-[1.25rem] px-12 py-6 text-lg bg-white text-primary hover:bg-white/90"
          >
            Get Started with GitSage
          </Button>
        </div>
      </div>
    </section>
  );
}