import Heading from '../common/Heading.jsx';
import Text from '../common/Text.jsx';

const TypographyDemo = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <Heading level={1} className="mb-4">
          Sistema de Tipografía
        </Heading>
        <Text size="tagline" className="text-gray-600">
          Demostración del sistema de tipografía implementado
        </Text>
      </div>

      {/* Encabezados */}
      <section className="space-y-6">
        <Heading level={2}>
          Encabezados
        </Heading>
        
        <div className="space-y-4">
          <Heading level={1} className="font-bold">
            H1 - Título Principal (56px desktop / 40px mobile)
          </Heading>
          
          <Heading level={2} className="font-bold">
            H2 - Título Secundario (48px desktop / 36px mobile)
          </Heading>
          
          <Heading level={3} className="font-semibold">
            H3 - Título Terciario (40px desktop / 32px mobile)
          </Heading>
          
          <Heading level={4} className="font-semibold">
            H4 - Subtítulo (32px desktop / 24px mobile)
          </Heading>
          
          <Heading level={5} className="font-medium">
            H5 - Encabezado Pequeño (24px desktop / 20px mobile)
          </Heading>
          
          <Heading level={6} className="font-medium">
            H6 - Encabezado Mínimo (20px desktop / 18px mobile)
          </Heading>
        </div>
      </section>

      {/* Texto de cuerpo */}
      <section className="space-y-6">
        <Heading level={2}>
          Texto de Cuerpo
        </Heading>
        
        <div className="space-y-4">
          <div>
            <Heading level={4} className="font-semibold mb-2">
              Large (20px)
            </Heading>
            <Text size="lg">
              Este es un párrafo de texto large con la familia Inter. Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </div>
          
          <div>
            <Heading level={4} className="font-semibold mb-2">
              Medium (18px)
            </Heading>
            <Text size="base">
              Este es un párrafo de texto medium con la familia Inter. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </div>
          
          <div>
            <Heading level={4} className="font-semibold mb-2">
              Regular (16px)
            </Heading>
            <Text size="base">
              Este es un párrafo de texto regular con la familia Inter. Duis aute irure dolor in 
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Text>
          </div>
          
          <div>
            <Heading level={4} className="font-semibold mb-2">
              Small (14px)
            </Heading>
            <Text size="sm">
              Este es un párrafo de texto small con la familia Inter. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </div>
          
          <div>
            <Heading level={4} className="font-semibold mb-2">
              Tiny (12px)
            </Heading>
            <Text size="xs">
              Este es un párrafo de texto tiny con la familia Inter. Sed ut perspiciatis unde 
              omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </Text>
          </div>
        </div>
      </section>

      {/* Pesos de fuente */}
      <section className="space-y-6">
        <Heading level={2}>
          Pesos de Fuente
        </Heading>
        
        <div className="space-y-3">
          <Text weight="extrabold">
            Extra Bold - Lorem ipsum dolor sit amet
          </Text>
          <Text weight="bold">
            Bold - Lorem ipsum dolor sit amet
          </Text>
          <Text weight="semibold">
            Semi Bold - Lorem ipsum dolor sit amet
          </Text>
          <Text weight="medium">
            Medium - Lorem ipsum dolor sit amet
          </Text>
          <Text weight="normal">
            Normal - Lorem ipsum dolor sit amet
          </Text>
          <Text weight="light">
            Light - Lorem ipsum dolor sit amet
          </Text>
        </div>
      </section>

      {/* Tagline */}
      <section className="space-y-6">
        <Heading level={2}>
          Tagline
        </Heading>
        
        <Text size="tagline" className="text-gray-600">
          Este es un ejemplo de tagline con 16px y line-height de 150%.
        </Text>
      </section>
    </div>
  );
};

export default TypographyDemo; 