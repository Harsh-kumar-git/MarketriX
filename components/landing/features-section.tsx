import {
  BarChart3,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Users,
  Zap,
  LineChart,
  Share2,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Intuitive Dashboard",
      description:
        "Get a bird's-eye view of your social media performance with our comprehensive dashboard.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Content Calendar",
      description:
        "Plan and schedule your content across multiple platforms from a single, visual calendar.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Content Generation",
      description:
        "Generate captions, hashtags, and ad copy with our AI-powered content tools.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Management",
      description:
        "Manage all your clients, campaigns, and approvals in one centralized location.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description:
        "Track engagement, growth, and ROI with detailed analytics and custom reports.",
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Multi-Platform Posting",
      description:
        "Publish content to all major social networks from a single interface.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Engagement Management",
      description:
        "Monitor and respond to comments and messages across all platforms.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Performance Insights",
      description:
        "Get actionable insights to optimize your content strategy and improve results.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Social Media Success</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to plan, create, schedule, and analyze your social media content in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}