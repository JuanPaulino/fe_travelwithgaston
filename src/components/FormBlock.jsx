import React, { useState } from 'react';

const FormBlock = ({ data, background = 'light' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Aquí iría la lógica para enviar el formulario
      // Por ahora simulamos un envío exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backgroundClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-900'
  };

  const buttonClasses = {
    light: 'bg-primary hover:bg-primary-dark text-white',
    dark: 'bg-primary hover:bg-primary-dark text-white',
    primary: 'bg-white hover:bg-neutral-lightest text-primary',
    secondary: 'bg-primary hover:bg-primary-dark text-white'
  };

  return (
    <section className={`py-16 px-4 ${backgroundClasses[background] || backgroundClasses.light}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Tagline */}
        {data.tagline && (
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-tagline font-medium ${
              background === 'light' || background === 'secondary' 
                ? 'bg-primary-lightest text-primary-dark' 
                : 'bg-white/20 text-white'
            }`}>
              {data.tagline}
            </span>
          </div>
        )}

        {/* Headline */}
        {data.headline && (
          <h2 className={`text-h2 sm:text-h2-desktop font-heading mb-6 ${
            background === 'light' || background === 'secondary' 
              ? 'text-neutral-darkest' 
              : 'text-white'
          }`}>
            {data.headline}
          </h2>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                background === 'light' || background === 'secondary'
                  ? 'border-neutral-light text-neutral-darkest placeholder-neutral-light'
                  : 'border-white/30 text-white placeholder-white/70 bg-white/10'
              }`}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                buttonClasses[background] || buttonClasses.light
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Suscribirse'}
            </button>
          </div>

          {/* Mensajes de estado */}
          {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-primary-lightest text-primary-dark rounded-lg">
              ¡Gracias por suscribirte! Te mantendremos informado.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-secondary-lightest text-secondary-dark rounded-lg">
              Hubo un error. Por favor, intenta de nuevo.
            </div>
          )}
        </form>

        {/* Información adicional */}
        <p className={`mt-6 text-sm font-body ${
          background === 'light' || background === 'secondary'
            ? 'text-neutral-light'
            : 'text-white/80'
        }`}>
          No compartiremos tu información con terceros. Puedes cancelar la suscripción en cualquier momento.
        </p>
      </div>
    </section>
  );
};

export default FormBlock;
