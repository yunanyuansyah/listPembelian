'use client';

import Hero from '@/components/Hero';
import ProductList from '@/components/Productlist';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-grey-600 to-cyan-200">
      <Hero />
      {isAuthenticated && (
        <main id="products">
          <ProductList />
          
        </main>
        
      )}
      
      <Footer />
    </div>
  );
}
