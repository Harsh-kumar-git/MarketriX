import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { PricingSection } from '@/components/landing/pricing-section';
import { FeaturesSection } from '@/components/landing/features-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                  Social Media Management Simplified
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Elevate Your Social Media <span className="text-primary">Marketing</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  All-in-one platform for agencies and freelancers to plan, create, schedule, and analyze social media content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-lg">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg p-6 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-medium">MarketiX Dashboard</h3>
                        <p className="text-muted-foreground text-sm">Powerful insights at your fingertips</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Social Media Strategy?</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Join thousands of agencies and freelancers who are growing their business with MarketiX.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/dashboard">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}