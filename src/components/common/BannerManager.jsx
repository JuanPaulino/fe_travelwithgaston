import React from 'react';
import { useStore } from '@nanostores/react';
import { $banners, removeBanner } from '../../stores/bannerStore';
import BannerContainer from './BannerContainer';

const BannerManager = () => {
  // Suscribirse al store de banners usando el hook de nanostores
  const banners = useStore($banners);

  return (
    <BannerContainer 
      banners={banners}
      onRemoveBanner={removeBanner}
      position="top-right"
    />
  );
};

export default BannerManager;
