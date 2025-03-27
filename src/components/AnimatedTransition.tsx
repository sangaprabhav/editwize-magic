
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
