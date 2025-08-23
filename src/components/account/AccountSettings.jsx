import React from 'react';
import PersonalDetailsForm from '../forms/PersonalDetailsForm';
import ChangePasswordForm from '../forms/ChangePasswordForm';

const AccountSettings = () => {
  // Datos iniciales para el formulario de datos personales
  const initialPersonalData = {
    firstName: 'Javier',
    lastName: 'Traveset',
    email: 'hola@mail.com',
    phone: '691515326',
    countryCode: '+44',
    address: '1 South Street, BRADFORD, BD52 3FD'
  };

  // Función para manejar la actualización de datos personales
  const handlePersonalDetailsUpdate = async (data) => {
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Actualizando datos personales:', data);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito (podrías usar un toast o notificación)
      alert('Personal details updated successfully!');
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw error; // Re-lanzar el error para que el formulario lo maneje
    }
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordUpdate = async (data) => {
    try {
      // Aquí iría la lógica para cambiar la contraseña en el backend
      console.log('Cambiando contraseña:', data);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error; // Re-lanzar el error para que el formulario lo maneje
    }
  };

  // Función para eliminar cuenta
  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar la cuenta
      console.log('Eliminando cuenta...');
    }
  };

  return (
    <div className="space-y-8">
      <PersonalDetailsForm 
        initialData={initialPersonalData}
        onUpdate={handlePersonalDetailsUpdate}
      />
      
      <ChangePasswordForm 
        onUpdate={handlePasswordUpdate}
      />
      
      {/* Delete Account Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleDeleteAccount}
          className="bg-white border border-black text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Delete account
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
