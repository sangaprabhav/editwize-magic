
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ArrowRight, Play, Image, Film, Upload } from 'lucide-react';

const Index = () => {
  // Parallax effect references
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const scrollPosition = window.scrollY;
      const elements = parallaxRef.current.querySelectorAll('[data-parallax]');
      
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.parallax || '0.1');
        const offset = scrollPosition * speed;
        
        element.style.transform = `translateY(${offset}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] rounded-full bg-primary/10 top-[-400px] left-[-200px] blur-3xl" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/10 bottom-[-300px] right-[-200px] blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedTransition delay={100}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                <span>Transform Your Videos With </span>
                <span className="text-gradient">AI Technology</span>
              </h1>
            </AnimatedTransition>
            
            <AnimatedTransition delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed">
                Edit videos using natural language. Simply describe what you want to change, and let AI do the work for you.
              </p>
            </AnimatedTransition>
            
            <AnimatedTransition delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth?mode=signup"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>
                
                <Link
                  to="#how-it-works"
                  className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
                >
                  <Play size={18} />
                  <span>How It Works</span>
                </Link>
              </div>
            </AnimatedTransition>
          </div>
          
          <AnimatedTransition delay={400}>
            <div className="mt-16 md:mt-24 glass-card p-1 md:p-2 max-w-5xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1649683/pexels-photo-1649683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="AI Video Editing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                  <button className="bg-white/20 backdrop-blur-sm text-white p-5 rounded-full hover:bg-white/30 transition-colors">
                    <Play size={32} />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/20" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedTransition>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Our AI-powered platform makes video editing easier than ever before. No technical skills required.
              </p>
            </AnimatedTransition>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-8 h-8 text-primary" />}
              title="Upload Your Video"
              description="Upload an existing video or record a new one directly in the app."
              index={0}
            />
            
            <FeatureCard
              icon={<Film className="w-8 h-8 text-primary" />}
              title="Describe Your Edits"
              description="Tell the AI what changes you want to make using simple text prompts."
              index={1}
            />
            
            <FeatureCard
              icon={<Image className="w-8 h-8 text-primary" />}
              title="Get Results Instantly"
              description="Review the AI-generated edit and make additional refinements if needed."
              index={2}
            />
          </div>
        </div>
      </section>
      
      {/* Examples Section */}
      <section className="py-16 md:py-24" ref={parallaxRef}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedTransition>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Create</h2>
              <p className="text-muted-foreground">
                From basic edits to complex transformations, our AI handles it all with simple text commands.
              </p>
            </AnimatedTransition>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <ExampleCard
              image="https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Add Text & Captions"
              prompt='"Add animated captions that follow the speech"'
              delay={0}
              parallaxSpeed="0.05"
            />
            
            <ExampleCard
              image="https://images.pexels.com/photos/2261166/pexels-photo-2261166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Apply Visual Effects"
              prompt='"Add a cinematic color grade with light leaks"'
              delay={100}
              parallaxSpeed="0.1"
            />
            
            <ExampleCard
              image="https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Add Music & Sound"
              prompt='"Add upbeat background music that matches the mood"'
              delay={200}
              parallaxSpeed="0.15"
            />
            
            <ExampleCard
              image="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Speed & Flow Adjustments"
              prompt='"Create a slow-motion effect for the jumping scene"'
              delay={300}
              parallaxSpeed="0.2"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <AnimatedTransition>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Videos?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using AI to edit videos faster and more creatively than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth?mode=signup"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
                >
                  <span>Create Free Account</span>
                  <ArrowRight size={18} />
                </Link>
                
                <Link
                  to="/auth?mode=login"
                  className="border border-border px-8 py-3 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-xl font-semibold flex items-center gap-2">
                <span className="text-gradient">AI</span>
                <span>Editor</span>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Editor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => (
  <AnimatedTransition delay={300 + index * 100}>
    <div className="glass-card p-8 h-full flex flex-col items-center text-center transition-transform hover:translate-y-[-5px] duration-300">
      <div className="bg-primary/10 p-4 rounded-full mb-6">{icon}</div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </AnimatedTransition>
);

// Example Card Component
interface ExampleCardProps {
  image: string;
  title: string;
  prompt: string;
  delay: number;
  parallaxSpeed: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ image, title, prompt, delay, parallaxSpeed }) => (
  <AnimatedTransition delay={300 + delay}>
    <div 
      className="glass-card overflow-hidden rounded-2xl border border-white/20"
      data-parallax={parallaxSpeed}
    >
      <div className="relative aspect-video">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm inline-block">
            {prompt}
          </div>
        </div>
      </div>
    </div>
  </AnimatedTransition>
);

export default Index;
