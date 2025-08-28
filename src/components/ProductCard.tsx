'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };



  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-200/50 hover:border-orange-400/70 hover:-translate-y-2 hover:scale-105">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-cyan-50">
        <Image
          src={product.image}
          alt={product.nama}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        

        
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
        {/* Category */}
        <div className="text-xs bg-gradient-to-r from-orange-100 to-cyan-100 text-orange-700 font-medium mb-2 px-3 py-1 rounded-full inline-block">
          {product.kategori}
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.nama}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.deskripsi}
        </p>
        

        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">
            {formatPrice(product.harga)}
          </span>
        </div>
        
        {/* Lihat Selengkapnya Button */}
        <Link href={`/products/${product.id}`}>
          <button className="w-full py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
            Lihat selengkapnya
          </button>
        </Link>
      </div>
    </div>
  );
}