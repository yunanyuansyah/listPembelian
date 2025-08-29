'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ListPembelian } from '@/types/database';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Add Product Card Component
function AddProductCard() {
  return (
    <Link className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-200/50 hover:border-orange-400/70 hover:-translate-y-2 hover:scale-105 cursor-pointer " href="/products/add">
      
        {/* Image Container - same size as ProductCard */}
        <div className="relative  overflow-hidden bg-gradient-to-br from-orange-50 to-cyan-50 flex w-full h-full items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      
    </Link>
  );
}

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange] = useState([0, 30000000]); // Increased range for database products
  const [editMode, setEditMode] = useState(false);
  const [deletingProducts, setDeletingProducts] = useState<Set<number>>(new Set());

  // Get products from database
  const { products, loading, error, fetchProducts } = useProducts();
  
  // Get user authentication info
  const { isAdminOrModerator, tokens } = useAuth();

  // Delete product function
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProducts(prev => new Set(prev).add(productId));
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the products list
      await fetchProducts();
      
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeletingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter((product: ListPembelian) => {
      const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.deskripsi && product.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = product.harga && product.harga >= priceRange[0] && product.harga <= priceRange[1];
      
      return matchesSearch && matchesPrice;
    });

    // Sort products
    filtered.sort((a: ListPembelian, b: ListPembelian) => {
      switch (sortBy) {
        case 'price-low':
          return (a.harga || 0) - (b.harga || 0);
        case 'price-high':
          return (b.harga || 0) - (a.harga || 0);
        case 'name':
        default:
          return a.nama.localeCompare(b.nama);
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, priceRange]);

  return (
    <section className="relative bg-gradient-to-br from-white via-grey-600 to-cyan-200 overflow-hidden">
      {/* Background Pattern - same as Hero */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-4">
          Daftar Pembelian Barang
        </h1>
        
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-6 mb-8 border border-orange-500 dark:border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-black dark:text-black mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-orange-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-white text-black dark:text-black placeholder-black dark:placeholder-black"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-black mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-orange-500 dark:border-orange-500 rounded-xl focus:ring-orange-500 focus:border-transparent bg-white dark:bg-white text-black dark:text-black placeholder-black dark:placeholder-black"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        {/*<div className="mt-4">
          <label className="block text-sm font-medium text-black dark:text-black mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1 h-2 bg-gray-200 dark:bg-orange-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>*/}
      </div>

      {/* Action Buttons - Only for Admin or Moderator */}
      {isAdminOrModerator && (
        <div className="flex justify-center gap-4 mb-6">
          {/* Add Product Button */}
          <Link href="/products/add">
            <button className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Product
              </div>
            </button>
          </Link>

          {/* Edit Mode Toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              editMode
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {editMode ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit Edit Mode
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Products
              </div>
            )}
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-black">
          {loading ? 'Loading...' : error ? 'Error loading products' : `Showing ${filteredProducts.length} of ${products?.length || 0} products`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-black">View:</span>
          <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-black">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-black">Error loading products</h3>
          <p className="mt-2 text-black">Please try again later.</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: ListPembelian) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              editMode={editMode && isAdminOrModerator}
              onDelete={handleDeleteProduct}
              isDeleting={deletingProducts.has(product.id)}
            />
          ))}
          {/* Add Product Card - Only for Admin or Moderator */}
          {isAdminOrModerator && <AddProductCard />}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-black">No products found</h3>
          <p className="mt-2 text-black">Try adjusting your search or filter criteria.</p>
          {/* Add Product Card in empty state - Only for Admin or Moderator */}
          {isAdminOrModerator && (
            <div className="mt-6">
              <AddProductCard />
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
