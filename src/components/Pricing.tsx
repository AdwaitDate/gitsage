import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    plan: "Free",
    price: "$0",
    description: "Perfect for individual developers",
    features: ["1 repo", "Basic AI Q&A", "Community Support"],
    cta: "Start Free",
    highlighted: false
  },
  {
    plan: "Pro",
    price: "$19/month",
    description: "For professional developers",
    features: ["Unlimited repos", "Advanced AI Q&A", "Priority Support", "API Access"],
    cta: "Upgrade to Pro",
    highlighted: true
  },
  {
    plan: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: ["Team access", "Dedicated AI models", "On-premise option", "Custom integrations"],
    cta: "Contact Sales",
    highlighted: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your development workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border border-border/50 rounded-[1.25rem] shadow-lg relative transition-all duration-300 hover:shadow-xl bg-card ${
                plan.highlighted 
                  ? 'border-primary shadow-primary/20 transform scale-105' 
                  : 'hover:border-primary/50'
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="p-8 text-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium">{plan.plan}</h3>
                  <div className="space-y-2">
                    <div className="text-4xl font-medium tracking-tight">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <div className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-6 text-base font-medium transition-all duration-200 ${
                      plan.highlighted 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}