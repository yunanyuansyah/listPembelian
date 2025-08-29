'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MigrationResult {
  message: string;
  success: boolean;
  count?: number;
}

export default function MigratePage() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigrate = async () => {
    setIsMigrating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to migrate data');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Migration</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This will migrate the static product data from your products.ts file to the PostgreSQL database.
              This action will clear any existing data in the listPembelian table.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Warning</h3>
              <p className="text-yellow-700 text-sm">
                This operation will delete all existing data in the listPembelian table and replace it with the static data.
                Make sure you have backed up any important data before proceeding.
              </p>
            </div>
          </div>

          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-4 rounded-md font-semibold transition-colors"
          >
            {isMigrating ? 'Migrating...' : 'Start Migration'}
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">✅ Migration Successful</h3>
              <p className="text-green-700">
                {result.message}
              </p>
              <p className="text-green-600 text-sm mt-2">
                Migrated {result.count} products to the database.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Migration Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Visit <Link href="/products" className="text-blue-500 hover:underline">/products</Link> to view your migrated data</li>
              <li>• Use the &quot;Add New Product&quot; button to add more products</li>
              <li>• Edit or delete products directly from the product list</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
