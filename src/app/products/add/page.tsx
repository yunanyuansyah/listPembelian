'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/contexts/AuthContext';

export default function AddProductPage() {
  const router = useRouter();
  const { tokens } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Calculate total harga automatically
  const totalHarga = formData.harga && formData.stok 
    ? (parseFloat(formData.harga) * parseInt(formData.stok)).toFixed(2)
    : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.nama.trim()) {
      alert('Nama product harus diisi!');
      setIsSubmitting(false);
      return;
    }

    if (!formData.harga || parseFloat(formData.harga) <= 0) {
      alert('Harga harus diisi dan lebih dari 0!');
      setIsSubmitting(false);
      return;
    }

    if (!formData.stok || parseInt(formData.stok) <= 0) {
      alert('Stok harus diisi dan lebih dari 0!');
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      nama: formData.nama.trim(),
      deskripsi: formData.deskripsi?.trim() || null,
      harga: parseFloat(formData.harga),
      stok: parseInt(formData.stok),
      total_harga: parseFloat(totalHarga),
    };

    console.log('Form data being sent:', requestData);

    try {
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

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: formDataToSend, // Don't set Content-Type header, let browser set it for FormData
      });

      if (response.ok) {
        // Reset form
        setFormData({
          nama: '',
          deskripsi: '',
          harga: '',
          stok: '',
        });
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        // Redirect to main page
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData);
        alert(`Error: ${errorData.error}\n${errorData.details || ''}\n\n${errorData.suggestion || ''}`);
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-4">
              Tambah Product Baru
            </h1>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Isi form di bawah ini untuk menambahkan product baru ke dalam daftar
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-500">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Foto Product
                </label>
                <div className="space-y-4">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="relative">
                      <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedFile?.name} ({selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} MB)
                      </p>
                    </div>
                  )}
                  
                  {/* Upload Instructions */}
                  <div className="text-sm text-gray-500">
                    <p>• Format yang didukung: JPG, PNG, GIF, WebP</p>
                    <p>• Ukuran maksimal: 5MB</p>
                    <p>• Foto akan ditampilkan di halaman product list</p>
                  </div>
                </div>
              </div>

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
                  placeholder="Masukkan deskripsi product"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    id="stok"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

                             <div>
                 <label htmlFor="total_harga" className="block text-sm font-medium text-gray-700 mb-2">
                   Total Harga (Otomatis)
                 </label>
                 <div className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                   <span className="text-lg font-semibold text-orange-600">
                     Rp {parseFloat(totalHarga).toLocaleString('id-ID')}
                   </span>
                 </div>
                 <p className="text-sm text-gray-500 mt-1">
                   Total harga dihitung otomatis dari Harga × Stok
                 </p>
               </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 disabled:from-orange-300 disabled:to-cyan-300 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isSubmitting ? 'Menambah...' : 'Tambah Product'}
                </button>
                <Link
                  href="/products"
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      </AdminGuard>
    </AuthGuard>
  );
}
