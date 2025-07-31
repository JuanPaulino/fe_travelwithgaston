const SimpleTypographyTest = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="font-heading text-h1 sm:text-h1-desktop bg-blue-100 p-4">
        H1 - Título Principal (40px mobile, 56px desktop)
      </h1>
      
      <h2 className="font-heading text-h2 sm:text-h2-desktop bg-green-100 p-4">
        H2 - Subtítulo (36px mobile, 48px desktop)
      </h2>
      
      <h3 className="font-heading text-h3 sm:text-h3-desktop bg-yellow-100 p-4">
        H3 - Sección (32px mobile, 40px desktop)
      </h3>
      
      <h4 className="font-heading text-h4 sm:text-h4-desktop bg-red-100 p-4">
        H4 - Subsección (24px mobile, 32px desktop)
      </h4>
      
      <h5 className="font-heading text-h5 sm:text-h5-desktop bg-purple-100 p-4">
        H5 - Pequeño (20px mobile, 24px desktop)
      </h5>
      
      <h6 className="font-heading text-h6 sm:text-h6-desktop bg-pink-100 p-4">
        H6 - Mínimo (18px mobile, 20px desktop)
      </h6>
      
      <div className="space-y-4">
        <p className="font-body text-lg leading-relaxed bg-gray-100 p-4">
          <strong>Large (20px):</strong> Este es un párrafo de texto large con la familia Inter.
        </p>
        
        <p className="font-body text-base leading-relaxed bg-gray-100 p-4">
          <strong>Base (16px):</strong> Este es un párrafo de texto base con la familia Inter.
        </p>
        
        <p className="font-body text-sm leading-relaxed bg-gray-100 p-4">
          <strong>Small (14px):</strong> Este es un párrafo de texto small con la familia Inter.
        </p>
        
        <p className="font-body text-xs leading-relaxed bg-gray-100 p-4">
          <strong>Tiny (12px):</strong> Este es un párrafo de texto tiny con la familia Inter.
        </p>
        
        <p className="font-body text-tagline bg-orange-100 p-4">
          <strong>Tagline (16px):</strong> Este es un ejemplo de tagline con line-height de 150%.
        </p>
      </div>
      
      <div className="space-y-2">
        <p className="font-body text-base font-extrabold">Extra Bold - Lorem ipsum dolor sit amet</p>
        <p className="font-body text-base font-bold">Bold - Lorem ipsum dolor sit amet</p>
        <p className="font-body text-base font-semibold">Semi Bold - Lorem ipsum dolor sit amet</p>
        <p className="font-body text-base font-medium">Medium - Lorem ipsum dolor sit amet</p>
        <p className="font-body text-base font-normal">Normal - Lorem ipsum dolor sit amet</p>
        <p className="font-body text-base font-light">Light - Lorem ipsum dolor sit amet</p>
      </div>
    </div>
  );
};

export default SimpleTypographyTest; 