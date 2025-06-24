"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      description: "For individuals and small freelancers",
      priceMonthly: 0,
      priceAnnually: 0,
      features: [
        "1 social media account",
        "Basic content calendar",
        "10 scheduled posts per month",
        "Basic analytics",
        "Email support",
      ],
      isPopular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      description: "For growing agencies and professionals",
      priceMonthly: 29,
      priceAnnually: 24,
      features: [
        "10 social media accounts",
        "Advanced content calendar",
        "Unlimited scheduled posts",
        "AI caption generation (100/mo)",
        "Detailed analytics & reports",
        "Client management portal",
        "Priority email support",
      ],
      isPopular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
    },
    {
      name: "Business",
      description: "For established agencies and teams",
      priceMonthly: 79,
      priceAnnually: 69,
      features: [
        "25 social media accounts",
        "Team collaboration tools",
        "Unlimited scheduled posts",
        "AI caption generation (500/mo)",
        "White-label reports",
        "Advanced analytics & insights",
        "API access",
        "Dedicated account manager",
      ],
      isPopular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your business needs
          </p>
          
          <div className="flex items-center justify-center mt-8 space-x-2">
            <span className={isAnnual ? "text-muted-foreground" : "font-medium"}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual billing"
            />
            <span className={!isAnnual ? "text-muted-foreground" : "font-medium"}>
              Annual <span className="text-sm text-primary">Save 15%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl p-8 border ${
                plan.isPopular ? "ring-2 ring-primary relative" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${isAnnual ? plan.priceAnnually : plan.priceMonthly}
                </span>
                <span className="text-muted-foreground">/month</span>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-1">Billed annually</p>
                )}
              </div>
              <Button
                variant={plan.buttonVariant}
                className="w-full mb-6"
                asChild
              >
                <Link href="/register">{plan.buttonText}</Link>
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}