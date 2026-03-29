import { useCallback, useState } from 'react';

type LightboxControllerState = {
  toggler: boolean;
  slide: number;
};

const useLightboxController = () => {
  const [lightboxController, setLightboxController] = useState<LightboxControllerState>({
    toggler: false,
    slide: 1
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxController((prev) => ({
      toggler: !prev.toggler,
      slide: index + 1
    }));
  }, []);

  return { lightboxController, openLightbox };
};

export default useLightboxController;
