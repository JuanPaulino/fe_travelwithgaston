import { useAuth } from '../../lib/useAuth';

const AuthStatus = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-600">Verificando autenticación...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-800 font-medium">
              Bienvenido, {user.firstName} {user.lastName}
            </p>
            <p className="text-green-600 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <p className="text-gray-600">No has iniciado sesión</p>
    </div>
  );
};

export default AuthStatus; 