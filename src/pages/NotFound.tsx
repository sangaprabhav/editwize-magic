
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AnimatedTransition from '@/components/AnimatedTransition';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AnimatedTransition>
        <div className="glass-card p-8 md:p-12 max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-5 py-2 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
            
            <Link 
              to="/" 
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full flex items-center gap-2 button-hover w-full sm:w-auto"
            >
              <Home size={18} />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default NotFound;
