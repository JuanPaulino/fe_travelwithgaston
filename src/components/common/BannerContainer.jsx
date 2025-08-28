import React from 'react';
import Banner from './Banner';

const BannerContainer = ({ banners, onRemoveBanner, position = 'top-right', className = '' }) => {
  if (!banners || banners.length === 0) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`fixed z-50 space-y-2 ${positionClasses[position]} ${className}`}>
      {banners.map((banner) => (
        <Banner
          key={banner.id}
          type={banner.type}
          message={banner.message}
          onClose={() => onRemoveBanner(banner.id)}
          className="max-w-sm shadow-lg"
        />
      ))}
    </div>
  );
};

export default BannerContainer;
