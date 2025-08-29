
import ProductList from '@/components/Productlist';
import AuthGuard from '@/components/AuthGuard';

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductList />
    </AuthGuard>
  );
}
