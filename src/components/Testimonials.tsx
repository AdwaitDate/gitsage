import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "GitSage has transformed how we onboard developers.",
    author: "Senior Engineer @ Startup"
  },
  {
    quote: "I get instant answers about complex repos without digging for hours.",
    author: "Open Source Maintainer"
  },
  {
    quote: "The AI understands our codebase better than some of our team members.",
    author: "Tech Lead @ Enterprise"
  },
  {
    quote: "Documentation becomes effortless when GitSage can explain any piece of code.",
    author: "Developer Relations @ SaaS Company"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl tracking-tight">
            Loved by Developers
          </h2>
          <p className="text-xl text-muted-foreground">
            See what developers are saying about GitSage
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <Card className="border-border/50 rounded-[1.25rem] shadow-lg">
                    <CardContent className="p-8 space-y-6">
                      <Quote className="w-8 h-8 text-primary opacity-50" />
                      <blockquote className="text-lg italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="block text-sm text-muted-foreground not-italic">
                        — {testimonial.author}
                      </cite>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="rounded-[1.25rem]" />
            <CarouselNext className="rounded-[1.25rem]" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}