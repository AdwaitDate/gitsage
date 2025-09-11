import Link from "next/link";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="from-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br px-6 pt-20">
      <div className="container mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl tracking-tight md:text-6xl">
              AI-Powered Insights for Your{" "}
              <span className="text-primary">GitHub Repos</span>
            </h1>
            <p className="text-muted-foreground max-w-lg text-xl">
              GitSage analyzes entire repositories with LLMs to give you instant
              answers, insights, and documentation.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="rounded-[1.25rem] px-8 py-6 text-lg">
              <Link href={"/sign-up"}>Get Started</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-[1.25rem] px-8 py-6 text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[1.25rem] shadow-2xl">
            <video
              src="/gitsage.mp4"
              autoPlay
              loop
              muted 
              playsInline
              className="h-auto w-full object-cover"
            />
            <div className="from-primary/20 to-accent/20 absolute inset-0 bg-gradient-to-tr"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
