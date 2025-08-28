'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, Product } from '@/data/products';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);


  useEffect(() => {
    const productId = parseInt(params.id as string);
    const foundProduct = products.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [params.id]);

  const formatPrice = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };



     if (!product) {
     return (
       <AuthGuard>
         <Header />
         <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 flex items-center justify-center">
           <div className="text-center">
             <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
             <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
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

  // Create multiple images for gallery (using the same image for demo)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

     return (
     <AuthGuard>
       <Header />
       <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 py-8">
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
                <Image
                  src={productImages[selectedImage]}
                  alt={product.nama}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
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
                    <Image
                      src={image}
                      alt={`${product.nama} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
                             {/* Category */}
               <div className="text-sm bg-gradient-to-r from-orange-100 to-cyan-100 text-orange-700 font-medium px-3 py-1 rounded-full inline-block">
                 {product.kategori}
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
               </div>

                             {/* Description */}
               <div className="space-y-4">
                                 <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{product.deskripsi}</p>
               </div>

                             {/* Stock Status */}
               <div className="space-y-2">
                                   <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${product.stok > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-lg font-medium ${product.stok > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {product.stok > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                 {product.stok > 0 && (
                   <div className="flex items-center space-x-2">
                     <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                     </svg>
                     <span className="text-lg text-gray-600">
                       Stock Barang Yang Ada : <span className="font-semibold text-blue-600">{product.stok} unit</span>
                     </span>
                   </div>
                 )}
               </div>

              


            </div>
          </div>


        </div>
      </div>
    </AuthGuard>
  );
}
