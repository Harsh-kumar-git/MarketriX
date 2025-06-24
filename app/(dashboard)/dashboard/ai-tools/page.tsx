"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Share, 
  Zap, 
  Hash, 
  MessageSquare,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

export default function AIToolsPage() {
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState("caption");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleGenerate = () => {
    setLoading(true);
    
    // In a real app, this would call an API connected to OpenAI or similar
    setTimeout(() => {
      let response = "";
      
      if (contentType === "caption") {
        if (platform === "instagram") {
          response = `✨ Elevate your workspace with our new ergonomic desk setup! Designed for comfort and productivity, this sleek arrangement brings style and functionality together.

Transform your home office into a space that inspires creativity and supports your wellbeing. #WorkFromHome #HomeOfficeGoals #ProductivityTips

What's your must-have desk accessory? Tell us in the comments! 👇`;
        } else {
          response = `Introducing our new ergonomic desk solution, designed to improve posture and productivity during those long work sessions. 

Our research shows that an optimized workspace can increase productivity by up to 27% while reducing strain and fatigue.

Check out our latest blog post for a complete guide to setting up your ideal workspace: [Link]`;
        }
      } else if (contentType === "hashtags") {
        response = `#WorkFromHome #HomeOffice #DeskSetup #ProductivityTips #ErgoOffice #RemoteWork #HomeWorkspace #DeskGoals #OfficeDesign #WorkspaceInspiration #SetupTour #OfficeMakeover #DeskAccessories #WorkLifeBalance #OrganizedDesk`;
      } else {
        response = `Looking for content ideas for your next post about home office setups? Here are 5 engaging topics:

1. Before & After: Show a desk transformation and the impact on productivity
2. Day in the Life: Time-lapse of a workday at your ergonomic setup
3. Top 5 Must-Have Desk Accessories for better focus and comfort
4. Quick Stretches: Simple exercises to do between meetings
5. Sound On: The perfect work-from-home ambient playlist to boost focus`;
      }
      
      setAiResponse(response);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Content Tools</h1>
        <p className="text-muted-foreground">
          Generate high-quality social media content with AI
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="improve">Improve Content</TabsTrigger>
          <TabsTrigger value="history">Content History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Content Generator
                </CardTitle>
                <CardDescription>
                  Describe what you want to create and let AI do the work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Content Type</p>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caption">Post Caption</SelectItem>
                      <SelectItem value="hashtags">Hashtags</SelectItem>
                      <SelectItem value="ideas">Content Ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Platform</p>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tone</p>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Prompt</p>
                  <Textarea 
                    placeholder="Describe what you want the AI to generate..." 
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={loading || !prompt}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Generated Content
                </CardTitle>
                <CardDescription>
                  Review and copy your AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-muted/40 min-h-[300px] p-4 relative">
                  {aiResponse ? (
                    <div className="whitespace-pre-line">{aiResponse}</div>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center h-full text-center p-6">
                      <Zap className="h-12 w-12 mb-4 opacity-50" />
                      <p className="mb-2">Your AI-generated content will appear here</p>
                      <p className="text-sm">Fill out the form and click "Generate Content" to get started</p>
                    </div>
                  )}
                  
                  {aiResponse && (
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopy}
                        className="h-8 w-8"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              {aiResponse && (
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => setAiResponse("")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Use Content
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular AI Templates</CardTitle>
              <CardDescription>Quick templates to generate specific content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <TemplateCard 
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Engaging Captions"
                  description="Create attention-grabbing captions for product photos"
                />
                <TemplateCard 
                  icon={<Hash className="h-5 w-5" />}
                  title="Hashtag Sets"
                  description="Generate relevant hashtags for maximum reach"
                />
                <TemplateCard 
                  icon={<Lightbulb className="h-5 w-5" />}
                  title="Content Ideas"
                  description="Get inspiration for your next week of content"
                />
                <TemplateCard 
                  icon={<Share className="h-5 w-5" />}
                  title="Carousel Posts"
                  description="Create educational multi-slide content"
                />
                <TemplateCard 
                  icon={<Zap className="h-5 w-5" />}
                  title="Call to Action"
                  description="Compelling CTAs to boost conversion"
                />
                <TemplateCard 
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Comment Replies"
                  description="Thoughtful responses to engage your audience"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="improve">
          <Card>
            <CardHeader>
              <CardTitle>Improve Existing Content</CardTitle>
              <CardDescription>
                Paste your content to enhance, rewrite, or optimize it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Content</p>
                    <Textarea 
                      placeholder="Paste your existing content here..." 
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Improvement Type</p>
                      <Select defaultValue="enhance">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enhance">Enhance</SelectItem>
                          <SelectItem value="shorten">Make Shorter</SelectItem>
                          <SelectItem value="lengthen">Make Longer</SelectItem>
                          <SelectItem value="tone">Change Tone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Platform</p>
                      <Select defaultValue="instagram">
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Improve Content
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Improved Result</p>
                  <div className="rounded-md border bg-muted/40 min-h-[270px] p-4 flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Your improved content will appear here
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Content History</CardTitle>
              <CardDescription>
                View and reuse your previously generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <Zap className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-lg font-medium">No content history yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Generate some content to see it here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}