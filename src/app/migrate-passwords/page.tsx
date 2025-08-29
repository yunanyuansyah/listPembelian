'use client';

import { useState } from 'react';

interface MigrationStatus {
  totalUsers: number;
  migratedUsers: number;
  hashedUsers: number;
  needsMigration: number;
  isComplete: boolean;
}

export default function MigratePasswordsPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/migrate-passwords');
      const data = await response.json();
      setStatus(data);
      setMessage('');
    } catch (error) {
      setMessage('Error checking migration status');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runMigration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/migrate-passwords', {
        method: 'POST',
      });
      const data = await response.json();
      setMessage(data.message || 'Migration completed');
      // Refresh status after migration
      await checkStatus();
    } catch (error) {
      setMessage('Error running migration');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Password Migration
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={checkStatus}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : 'Check Migration Status'}
          </button>

          {status && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Migration Status:</h3>
              <p>Total Users: {status.totalUsers}</p>
              <p>Hashed Users: {status.hashedUsers}</p>
              <p>Needs Migration: {status.needsMigration ? 'Yes' : 'No'}</p>
            </div>
          )}

          {status?.needsMigration && (
            <button
              onClick={runMigration}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Migrating...' : 'Run Password Migration'}
            </button>
          )}

          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>This will hash all existing plain text passwords</li>
              <li>Make sure to backup your database before running migration</li>
              <li>Migration should only be run once</li>
              <li>Users will need to use their original passwords to login</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
