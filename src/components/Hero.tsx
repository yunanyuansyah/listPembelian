'use client';

import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Notification from './Notification';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface AuthData {
  user: {
    id: number;
    email: string;
    nama: string;
    nomor: string;
    status: 'admin' | 'user';
    created_at: string;
    updated_at: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export default function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null);
  const { user, login, logout } = useAuth();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginSuccess = (authData: AuthData) => {
    login(authData.user, authData.tokens);
    setNotification({ message: `Selamat datang, ${authData.user.nama}!`, type: 'success' });
    console.log('Login successful:', authData);
  };

  const handleRegisterSuccess = (authData: AuthData) => {
    login(authData.user, authData.tokens);
    setNotification({ message: `Registrasi berhasil! Selamat datang, ${authData.user.nama}!`, type: 'success' });
    console.log('Register successful:', authData);
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
    setNotification({ message: 'Anda telah berhasil logout', type: 'info' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-grey-600 to-cyan-200 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={`absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl transition-all duration-1000 ${isVisible ? 'animate-pulse' : ''}`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transition-all duration-1000 delay-300 ${isVisible ? 'animate-pulse' : ''}`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transition-all duration-1000 delay-500 ${isVisible ? 'animate-pulse' : ''}`}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="text-center">
          {/* Main Heading with Animation */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Daftar Pembelian
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                Barang
              </span>
            </h1>
          </div>
          
          {/* Subtitle with Animation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto leading-relaxed">
              {user ? `${getGreeting()}, ${user.nama}!` : 'Login Untuk Melihat Daftar Pembelian Barang!'}
            </p>
          </div>
          
          {/* Interactive Content */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {user ? (
              <div className="text-center">
                {/* Enhanced User Dashboard */}
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto border border-white/20">
                  {/* Time and Date Display */}
                  <div className="mb-6">
                    <div className="text-3xl font-mono font-bold text-gray-800 mb-2">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(currentTime)}
                    </div>
                  </div>

                  {/* User Info with Animation */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.nama}</h2>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        user.status === 'admin' ? 'bg-red-500' : 
                        user.status === 'mods' ? 'bg-orange-500' : 
                        'bg-blue-500'
                      }`}></span>
                      <span className={
                        user.status === 'admin' ? 'text-red-600' : 
                        user.status === 'mods' ? 'text-orange-600' : 
                        'text-blue-600'
                      }>
                        {user.status === 'admin' ? 'Administrator' : 
                         user.status === 'mods' ? 'Moderator' : 
                         'User'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-600">📦</div>
                      <div className="text-sm text-orange-700 font-medium">Products</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600">👥</div>
                      <div className="text-sm text-blue-700 font-medium">Users</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                      href="/products"
                      className="group bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Lihat Products
                    </Link>
                    
                    {user.status === 'admin' && (
                      <Link 
                        href="/admin"
                        className="group bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    
                    {user.status === 'mods' && (
                      <Link 
                        href="/products"
                        className="group bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Manage Products
                      </Link>
                    )}
                    
                    <Link 
                      href="/profile"
                      className="group bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-500 transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex sm:flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleLoginClick}
                  className="group bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Login
                    <svg className=" w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>
                <button 
                  onClick={handleRegisterClick}
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
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
      
      {/* Floating Action Buttons */}
      {user && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          {/* Quick Add Product Button */}
          <Link
            href="/products/add"
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
            title="Add New Product"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
          
          {/* Quick Search Button */}
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
            title="Quick Search"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white hover:text-orange-300 transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Floating Particles Animation 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white opacity-20 rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div> */}

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

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </section>
  );
}
