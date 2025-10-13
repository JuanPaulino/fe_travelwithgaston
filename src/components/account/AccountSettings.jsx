import React, { useState } from 'react';
import PersonalDetailsForm from '../forms/PersonalDetailsForm';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import { getUser, getToken } from '../../stores/authStore';
import { userAPI } from '../../lib/http';
import { showSuccess, showError, showInfo } from '../../stores/bannerStore';
import ConfirmationModal from '../common/ConfirmationModal';

const AccountSettings = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Obtener datos del usuario desde el store de autenticación
  const user = getUser();
  const token = getToken();
  
  // Datos iniciales para el formulario de datos personales
  const initialPersonalData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '', // Usar el teléfono del usuario si existe
    countryCode: user?.countryCode || '+34', // Usar el código de país del usuario si existe
    country: user?.country || ''
  };

  // Función para manejar la actualización de datos personales
  const handlePersonalDetailsUpdate = async (data) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!token || !user) {
        throw new Error('User not authenticated');
      }

      // Preparar los datos para enviar al backend
    const updateData = {
      phone: data.phone,
      countryCode: data.countryCode,
      country: data.country
    };

      // Llamar al endpoint de actualización de perfil
      const response = await userAPI.updateProfile(updateData);
      
      if (response.success) {
        // Mostrar mensaje de éxito
        showSuccess('Personal details updated successfully!', { autoHide: true });
        
        // Aquí podrías actualizar el store local si es necesario
        // o recargar los datos del usuario
        console.log('Data updated:', response.data);
      } else {
        throw new Error(response.message || 'Error updating data');
      }
    } catch (error) {
      console.error('Error updating personal details:', error);
      showError(`Error updating data: ${error.message}`, { autoHide: true });
      throw error; // Re-lanzar el error para que el formulario lo maneje
    }
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordUpdate = async (data) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!token || !user) {
        throw new Error('User not authenticated');
      }

      // Llamar al endpoint para cambiar la contraseña
      const response = await userAPI.changePassword(data);
      
      if (response.success) {
        // Mostrar mensaje de éxito
        showSuccess('Password changed successfully!', { autoHide: true });
        console.log('Password updated:', response.message);
      } else {
        throw new Error(response.message || 'Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showError(`Error changing password: ${error.message}`, { autoHide: true });
      throw error; // Re-lanzar el error para que el formulario lo maneje
    }
  };

  // Función para eliminar cuenta
  const handleDeleteAccount = async () => {
    setModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await userAPI.requestAccountDeletion();

      if (response.success) {
        showInfo('Account deletion request sent successfully.', { autoHide: true });
      } else {
        throw new Error(response.message || 'Error requesting account deletion');
      }
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      showError(`Error: ${error.message}`, { autoHide: true });
    }
    setModalOpen(false);
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
      
      {/* Button to request account deletion */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleDeleteAccount}
          className="bg-white border border-black text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Request account deletion
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to request account deletion? You will not be able to make reservations, and if everything is in order, your account will be deleted in 30 days."
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteAccount}
      />
    </div>
  );
};

export default AccountSettings;
