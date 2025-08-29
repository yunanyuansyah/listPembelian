'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ListPembelian } from '@/types/database';
import AuthGuard from '@/components/AuthGuard';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { tokens } = useAuth();
  const [product, setProduct] = useState<ListPembelian | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
  });

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
        
        // Populate form with existing data
        setFormData({
          nama: productData.nama || '',
          deskripsi: productData.deskripsi || '',
          harga: productData.harga ? productData.harga.toString() : '',
          stok: productData.stok ? productData.stok.toString() : '',
        });
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



  // Calculate total harga automatically
  const totalHarga = formData.harga && formData.stok
    ? (parseFloat(formData.harga) * parseInt(formData.stok)).toFixed(2)
    : '0';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nama.trim()) {
      alert('Nama product harus diisi');
      return;
    }
    
    if (!formData.harga || parseFloat(formData.harga) <= 0) {
      alert('Harga harus diisi dan lebih dari 0');
      return;
    }
    
    if (!formData.stok || parseInt(formData.stok) < 0) {
      alert('Stok harus diisi dan tidak boleh negatif');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        nama: formData.nama.trim(),
        deskripsi: formData.deskripsi?.trim() || null,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok),
        total_harga: parseFloat(totalHarga),
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nama', requestData.nama);
      formDataToSend.append('deskripsi', requestData.deskripsi || '');
      formDataToSend.append('harga', requestData.harga.toString());
      formDataToSend.append('stok', requestData.stok.toString());
      formDataToSend.append('total_harga', requestData.total_harga.toString());
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: formDataToSend, // Don't set Content-Type for FormData
      });

      if (response.ok) {
        alert('Product updated successfully!');
        router.push(`/products/${params.id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button 
              onClick={() => router.push('/products')}
              className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-cyan-600 transition-all duration-300"
            >
              Back to Products
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4">
              Edit Product
            </h1>
            <p className="text-lg text-black">
              Update product information
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Product */}
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Product *
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan nama product"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Product (Optional)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  
                  {/* Current Image */}
                  {product.image_path && !previewUrl && (
                    <div className="relative">
                      <Image
                        src={product.image_path}
                        alt="Current product image"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <p className="text-sm text-gray-500 mt-1">Current image</p>
                    </div>
                  )}
                  
                  {/* Preview New Image */}
                  {previewUrl && (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                      <p className="text-sm text-gray-500 mt-1">New image preview</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <p>• Format yang didukung: JPG, PNG, GIF, WebP</p>
                    <p>• Ukuran maksimal: 5MB</p>
                    <p>• Kosongkan jika tidak ingin mengubah gambar</p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan deskripsi product (opsional)"
                />
              </div>

              {/* Harga */}
              <div>
                <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga *
                </label>
                <input
                  type="number"
                  id="harga"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan harga product"
                />
              </div>

              {/* Stok */}
              <div>
                <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-2">
                  Stok *
                </label>
                <input
                  type="number"
                  id="stok"
                  name="stok"
                  value={formData.stok}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan jumlah stok"
                />
              </div>

              {/* Total Harga (Otomatis) */}
              <div>
                <label htmlFor="total_harga" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Harga (Otomatis)
                </label>
                <div className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <span className="text-lg font-semibold text-orange-600">
                    Rp {parseFloat(totalHarga).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Total harga dihitung otomatis dari Harga × Stok</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/products/${params.id}`)}
                  className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white hover:shadow-lg transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </AdminGuard>
    </AuthGuard>
  );
}
