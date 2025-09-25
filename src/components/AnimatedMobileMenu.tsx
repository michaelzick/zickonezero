import { useState, useEffect } from 'react';
import { LinkBoxMobileContent } from '.';

type AnimatedMobileMenuProps = {
  isVisible: boolean;
};

const AnimatedMobileMenu = ({ isVisible }: AnimatedMobileMenuProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show the component and start enter animation
      setShouldRender(true);
      setIsAnimating(true);
    } else if (shouldRender) {
      // Start exit animation
      setIsAnimating(false);
      // Remove component after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldRender]);

  if (!shouldRender) return null;

  return <LinkBoxMobileContent isAnimating={isAnimating} />;
};

export default AnimatedMobileMenu;
