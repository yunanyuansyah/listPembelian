import ProductListDB from '@/components/ProductListDB';
import AddProductForm from '@/components/AddProductForm';
import AuthGuard from '@/components/AuthGuard';

export default function ProductsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <AddProductForm />
          </div>
          
          <ProductListDB />
        </div>
      </div>
    </AuthGuard>
  );
}
