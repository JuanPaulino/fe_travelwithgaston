const Text = ({ 
  children, 
  className = '',
  size = 'base',
  weight = 'normal',
  as = 'p'
}) => {
  const Tag = as;
  
  const getTextClasses = () => {
    const baseClasses = 'font-body leading-relaxed';
    const sizeClasses = {
      'lg': 'text-lg',
      'base': 'text-base',
      'sm': 'text-sm',
      'xs': 'text-xs',
      'tagline': 'text-tagline',
    };
    const weightClasses = {
      'extrabold': 'font-extrabold',
      'bold': 'font-bold',
      'semibold': 'font-semibold',
      'medium': 'font-medium',
      'normal': 'font-normal',
      'light': 'font-light',
    };
    
    return `${baseClasses} ${sizeClasses[size] || sizeClasses.base} ${weightClasses[weight] || weightClasses.normal} ${className}`;
  };

  return (
    <Tag className={getTextClasses()}>
      {children}
    </Tag>
  );
};

export default Text; 