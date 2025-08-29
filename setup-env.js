#!/usr/bin/env node

/**
 * Setup Environment Variables for Local Development
 * This script helps you create .env.local file with proper configuration
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Setting up environment variables for local development...\n');

  try {
    // Check if .env.local already exists
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
    }

    // Get database configuration
    console.log('📊 Database Configuration:');
    const dbHost = await question('PostgreSQL Host (default: localhost): ') || 'localhost';
    const dbPort = await question('PostgreSQL Port (default: 5432): ') || '5432';
    const dbName = await question('Database Name (default: listbarang_db): ') || 'listbarang_db';
    const dbUser = await question('PostgreSQL Username: ');
    const dbPassword = await question('PostgreSQL Password: ');

    if (!dbUser || !dbPassword) {
      console.log('❌ Username and password are required!');
      rl.close();
      return;
    }

    // Generate NextAuth secret
    const nextAuthSecret = crypto.randomBytes(32).toString('hex');

    // Create environment variables content
    const envContent = `# Database Configuration for Local Development
# Generated on ${new Date().toISOString()}

# PostgreSQL Connection String
POSTGRES_URL="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}"

# Alternative: Individual connection parameters
POSTGRES_HOST="${dbHost}"
POSTGRES_PORT="${dbPort}"
POSTGRES_DATABASE="${dbName}"
POSTGRES_USERNAME="${dbUser}"
POSTGRES_PASSWORD="${dbPassword}"

# For Vercel Postgres compatibility
POSTGRES_PRISMA_URL="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Development flags
NODE_ENV="development"
`;

    // Write .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');

    // Show next steps
    console.log('\n📋 Next Steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Create database and run: psql -U ' + dbUser + ' -d ' + dbName + ' -f database-setup.sql');
    console.log('3. Start development server: npm run dev');
    console.log('4. Visit http://localhost:3000');

    console.log('\n🔧 Database Setup Commands:');
    console.log(`psql -U ${dbUser} -c "CREATE DATABASE ${dbName};"`);
    console.log(`psql -U ${dbUser} -d ${dbName} -f database-setup.sql`);

  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setupEnvironment();
