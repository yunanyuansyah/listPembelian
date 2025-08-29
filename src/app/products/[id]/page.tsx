'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ListPembelian } from '@/types/database';
import AuthGuard from '@/components/AuthGuard';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ListPembelian | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productId = params.id as string;
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const formatPrice = (harga: number | null) => {
    if (!harga) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  // Loading state
  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error === 'Product not found' 
                ? "The product you're looking for doesn't exist." 
                : "There was an error loading the product. Please try again."}
            </p>
            <Link 
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-cyan-600 transition-all duration-300"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Create image gallery - use product image if available, otherwise use placeholder
  const productImages = product.image_path 
    ? [product.image_path, product.image_path, product.image_path, product.image_path]
    : ['/placeholder-image.svg', '/placeholder-image.svg', '/placeholder-image.svg', '/placeholder-image.svg'];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/products" className="ml-1 text-gray-700 hover:text-orange-600 transition-colors md:ml-2">
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{product.nama}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto">
                {product.image_path ? (
                  <Image
                    src={product.image_path}
                    alt={product.nama}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-cyan-50">
                    <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {product.image_path ? (
                      <Image
                        src={image}
                        alt={`${product.nama} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-cyan-50">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Stock Badge */}
              <div className="text-sm bg-gradient-to-r from-orange-100 to-cyan-100 text-orange-700 font-medium px-3 py-1 rounded-full inline-block">
                Stock: {product.stok || 0} unit
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900">{product.nama}</h1>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">
                    {formatPrice(product.harga)}
                  </span>
                </div>
                {product.total_harga && (
                  <div className="text-lg text-gray-600">
                    Total Harga: <span className="font-semibold text-orange-600">{formatPrice(product.total_harga)}</span>
                  </div>
                )}
                {product.stok && (
                  <div className="text-lg text-gray-600">
                    Jumlah Barang: <span className="font-semibold text-orange-600">{product.stok} unit</span> 
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {product.deskripsi || 'No description available for this product.'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${(product.stok || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-lg font-medium ${(product.stok || 0) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {(product.stok || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {(product.stok || 0) > 0 && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-lg text-gray-600">
                      Available Stock: <span className="font-semibold text-blue-600">{product.stok || 0} unit</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium text-black">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-black">
                    {new Date(product.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}