import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/layout/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  // For demo purposes - sets a default email
  const setDemoUser = (type: 'admin' | 'doctor' | 'receptionist' | 'accountant') => {
    const demoUsers = {
      admin: 'admin@clinica.com',
      doctor: 'alejandro.ramirez@clinica.com',
      receptionist: 'lucia.sanchez@clinica.com',
      accountant: 'pedro.vargas@clinica.com'
    };
    
    setEmail(demoUsers[type]);
    setPassword('123456'); // Dummy password, won't be checked in this demo
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta para gestionar tu clínica
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              icon={<Mail size={18} />}
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              icon={<Lock size={18} />}
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Iniciar sesión
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Acceso rápido para demo</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDemoUser('admin')}
                className="text-sm"
              >
                Administrador
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDemoUser('doctor')}
                className="text-sm"
              >
                Doctor
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDemoUser('receptionist')}
                className="text-sm"
              >
                Recepcionista
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDemoUser('accountant')}
                className="text-sm"
              >
                Contador
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;