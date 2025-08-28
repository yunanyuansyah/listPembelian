'use client';

import { useProducts } from '@/hooks/useProducts';
import { ListPembelian } from '@/types/database';

interface ProductCardProps {
  product: ListPembelian;
  onEdit?: (product: ListPembelian) => void;
  onDelete?: (id: number) => void;
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.nama}</h3>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      {product.deskripsi && (
        <p className="text-gray-600 mb-4">{product.deskripsi}</p>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Harga:</span>
          <span className="ml-2 text-green-600 font-semibold">
            ${product.harga?.toFixed(2) || 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Stok:</span>
          <span className={`ml-2 font-semibold ${product.stok > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stok}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Total Harga:</span>
          <span className="ml-2 text-blue-600 font-semibold">
            ${product.total_harga?.toFixed(2) || 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Created:</span>
          <span className="ml-2 text-gray-500">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductListDB() {
  const { products, loading, error, deleteProduct } = useProducts();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Products</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-gray-800 font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-600">Start by adding some products to your list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product List (Database)</h2>
        <span className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
