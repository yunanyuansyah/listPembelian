'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white dark:bg-white backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-black">TechStore</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link href="/products" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors">
                Products
              </Link>
            )}
            <a href="#barang" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors">
              Barang
            </a>
            <a href="#" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors">
              Kategori
            </a>
            <a href="#" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors">
              Kontak
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-black dark:border-gray-600 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-transparent text-gray-900 dark:text-black placeholder-gray-500 dark:placeholder-black"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* User */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-black">
                  Welcome, {user?.nama}
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  title="Logout"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button className="p-2 text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20 dark:border-gray-700/30">
              <Link href="/" className="text-gray-900 dark:text-black block px-3 py-2 text-base font-medium">
                Home
              </Link>
              {isAuthenticated ? (
                <Link href="/products" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 block px-3 py-2 text-base font-medium">
                  Products
                </Link>
              ) : (
                <a href="#products" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 block px-3 py-2 text-base font-medium">
                  Products
                </a>
              )}
              <a href="#" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 block px-3 py-2 text-base font-medium">
                Categories
              </a>
              <a href="#" className="text-gray-600 dark:text-black hover:text-orange-600 dark:hover:text-orange-400 block px-3 py-2 text-base font-medium">
                Contact
              </a>
              {isAuthenticated && (
                <div className="px-3 py-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600 dark:text-black mb-2">
                    Welcome, {user?.nama}
                  </div>
                  <button 
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
