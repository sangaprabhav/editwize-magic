
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/authContext';
import AnimatedTransition from './AnimatedTransition';
import { LogOut, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass-card bg-white/80 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <AnimatedTransition delay={100}>
            <Link 
              to="/" 
              className="text-2xl font-semibold text-foreground button-hover flex items-center gap-2"
            >
              <span className="text-gradient">AI</span>
              <span>Editor</span>
            </Link>
          </AnimatedTransition>
          
          {/* Desktop Navigation */}
          <AnimatedTransition delay={200} className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <NavLink to="/" label="Home" currentPath={location.pathname} />
              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard" label="Dashboard" currentPath={location.pathname} />
                  <NavLink to="/videos" label="My Videos" currentPath={location.pathname} />
                </>
              )}
            </nav>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/editor" 
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-full button-hover"
                  >
                    New Edit
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    <img 
                      src={user?.avatar} 
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                    />
                    <button 
                      onClick={logout}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Log out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/auth?mode=login" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/auth?mode=signup" 
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-full button-hover"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </AnimatedTransition>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 top-[76px] bg-background/95 backdrop-blur-lg z-40 transition-all duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <MobileNavLink to="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            {isAuthenticated && (
              <>
                <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/videos" label="My Videos" onClick={() => setMobileMenuOpen(false)} />
              </>
            )}
          </nav>
          
          <div className="mt-6 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/editor"
                  className="w-full bg-primary text-primary-foreground text-center px-5 py-3 rounded-xl button-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Edit
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-foreground"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth?mode=login"
                  className="w-full border border-input text-foreground text-center px-5 py-3 rounded-xl button-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/auth?mode=signup"
                  className="w-full bg-primary text-primary-foreground text-center px-5 py-3 rounded-xl button-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label, currentPath }: { to: string; label: string; currentPath: string }) => {
  const isActive = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
  
  return (
    <Link 
      to={to} 
      className={cn(
        "relative py-2 transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/70",
      )}
    >
      {label}
      <span 
        className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
          isActive ? "w-full" : "w-0"
        )}
      />
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => {
  return (
    <Link 
      to={to} 
      className="text-foreground text-lg py-3 border-b border-border/50 hover:text-primary transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Header;
