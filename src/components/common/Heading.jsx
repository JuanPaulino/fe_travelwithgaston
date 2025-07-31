const Heading = ({ 
  level = 1, 
  children, 
  className = '',
  as = null 
}) => {
  const Tag = as || `h${level}`;
  
  const getHeadingClasses = () => {
    const baseClasses = 'font-heading';
    const sizeClasses = {
      1: 'text-h1 sm:text-h1-desktop',
      2: 'text-h2 sm:text-h2-desktop',
      3: 'text-h3 sm:text-h3-desktop',
      4: 'text-h4 sm:text-h4-desktop',
      5: 'text-h5 sm:text-h5-desktop',
      6: 'text-h6 sm:text-h6-desktop',
    };
    
    return `${baseClasses} ${sizeClasses[level] || sizeClasses[1]} ${className}`;
  };

  return (
    <Tag className={getHeadingClasses()}>
      {children}
    </Tag>
  );
};

export default Heading; 