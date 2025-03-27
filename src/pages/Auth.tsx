
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Check mode from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    setIsLogin(mode !== 'signup');
  }, [location.search]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle between login and signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    // Update URL for bookmarking
    navigate(`/auth?mode=${isLogin ? 'signup' : 'login'}`);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <AnimatedTransition delay={100}>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <span className="text-gradient">AI</span>
              <span>Editor</span>
            </h1>
            <h2 className="text-2xl font-medium mb-6">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border bg-background focus:ring-2"
                    placeholder="Your name"
                  />
                </div>
              )}
              
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border bg-background focus:ring-2"
                  placeholder="example@email.com"
                />
              </div>
              
              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border bg-background focus:ring-2 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl button-hover disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
              
              {/* Toggle mode */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium ml-1"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>
          </AnimatedTransition>
        </div>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full bg-primary top-1/4 -right-20 blur-3xl" />
          <div className="absolute w-96 h-96 rounded-full bg-accent bottom-1/4 -left-20 blur-3xl" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <AnimatedTransition delay={300} className="glass-card p-8">
            <h3 className="text-2xl font-medium mb-4">AI-Powered Video Editing</h3>
            <p className="text-muted-foreground mb-6">
              Transform your videos with simple text prompts. Add captions, effects, music, and more - all with the power of AI.
            </p>
            <div className="space-y-4">
              <Feature icon="🎬" text="Upload or record videos directly in the app" />
              <Feature icon="✏️" text="Edit with simple text prompts" />
              <Feature icon="🎵" text="Add background music and effects" />
              <Feature icon="🔄" text="Make unlimited revisions" />
              <Feature icon="📱" text="Share to social media in one click" />
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

// Feature component
const Feature: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-start space-x-3">
    <div className="text-xl">{icon}</div>
    <p className="text-sm text-foreground">{text}</p>
  </div>
);

export default Auth;
