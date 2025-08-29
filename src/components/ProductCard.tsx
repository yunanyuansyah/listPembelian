'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ListPembelian } from '@/types/database';

interface ProductCardProps {
  product: ListPembelian;
  editMode?: boolean;
  onDelete?: (productId: number) => void;
  isDeleting?: boolean;
}

export default function ProductCard({ product, editMode = false, onDelete, isDeleting = false }: ProductCardProps) {
  const formatPrice = (harga: number | null) => {
    if (!harga) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-200/50 hover:border-orange-400/70 hover:-translate-y-2 hover:scale-105 relative">
      {/* Edit/Delete Buttons - Floating on top */}
      {editMode && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {/* Edit Button - Circular */}
          <Link href={`/products/${product.id}/edit`}>
            <button className="group w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </Link>
          
          {/* Delete Button - Circular */}
          <button
            onClick={() => onDelete?.(product.id)}
            disabled={isDeleting}
            className="group w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-cyan-50">
        {product.image_path ? (
          <Image
            src={product.image_path}
            alt={product.nama}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Quick View Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Link href={`/products/${product.id}`}>
            <button className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:from-orange-600 hover:to-cyan-600 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl">
              Quick View
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stock Info */}
        <div className="text-xs bg-gradient-to-r from-orange-100 to-cyan-100 text-orange-700 font-medium mb-2 px-3 py-1 rounded-full inline-block">
          Stock: {product.stok || 0}
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.nama}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.deskripsi || 'No description available'}
        </p>
        
        {/* Price */}
        <div className="space-y-1 mb-4">
          <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">
            {formatPrice(product.harga)}
          </div>
          {product.total_harga && (
            <div className="text-sm text-gray-500">
              Total: {formatPrice(product.total_harga)}
            </div>
          )}
        </div>
        
        {/* Action Button - Only show in normal mode */}
        {!editMode && (
          <Link href={`/products/${product.id}`}>
            <button className="w-full py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
              Lihat selengkapnya
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}