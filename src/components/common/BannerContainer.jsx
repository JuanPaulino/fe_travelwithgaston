import React from 'react';
import Banner from './Banner';

const BannerContainer = ({ banners, onRemoveBanner, className = '' }) => {
  if (!banners || banners.length === 0) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  // Agrupar banners por posición
  const bannersByPosition = banners.reduce((acc, banner) => {
    const position = banner.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(banner);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(bannersByPosition).map(([position, positionBanners]) => (
        <div 
          key={position}
          className={`fixed z-50 space-y-2 ${positionClasses[position]} ${className}`}
        >
          {positionBanners.map((banner) => (
            <Banner
              key={banner.id}
              type={banner.type}
              message={banner.message}
              onClose={() => onRemoveBanner(banner.id)}
              className="max-w-sm shadow-lg"
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default BannerContainer;
