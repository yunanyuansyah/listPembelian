'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginSuccess = (userData: any) => {
    login(userData);
    console.log('Login successful:', userData);
    // Di sini Anda bisa menambahkan logic untuk redirect atau update UI
  };

  const handleRegisterSuccess = (userData: any) => {
    login(userData);
    console.log('Register successful:', userData);
    // Di sini Anda bisa menambahkan logic untuk redirect atau update UI
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };
  return (
    <section className="relative bg-gradient-to-br from-white via-grey-600 to-cyan-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
            List Pembelian
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Barang
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto leading-relaxed">
            Login Untuk Melihat List Pembelian Barang!
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center items-center mb-12">
            {user ? (
              <div className="text-center">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <p className="text-lg text-green-600 mb-2">Selamat datang, {user.nama}!</p>
                  <p className="text-sm text-gray-600 mb-2">Email: {user.email}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Status: <span className={`font-semibold ${user.status === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                      {user.status.toUpperCase()}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    <Link 
                      href="/products"
                      className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-500 transition-colors"
                    >
                      Lihat Products
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={handleLoginClick}
                  className="group bg-orange-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Login
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>
                <button 
                  onClick={handleRegisterClick}
                  className="group bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Daftar
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </section>
  );
}
