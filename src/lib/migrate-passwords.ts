import { Pool } from 'pg';
import { hashPassword } from './auth/password';

// Create a connection pool for migration
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: false,
});

interface User {
  id: number;
  password: string;
}

/**
 * Migrate existing plain text passwords to hashed passwords
 * This should be run once after implementing password hashing
 */
export async function migratePasswords(): Promise<void> {
  try {
    console.log('Starting password migration...');
    
    // Get all users with plain text passwords
    const { rows: users } = await pool.query<User>(
      'SELECT id, password FROM users WHERE password NOT LIKE $1',
      ['$2b$%'] // bcrypt hashes start with $2b$
    );
    
    console.log(`Found ${users.length} users with plain text passwords`);
    
    if (users.length === 0) {
      console.log('No passwords to migrate');
      return;
    }
    
    // Hash each password
    for (const user of users) {
      try {
        console.log(`Migrating password for user ID: ${user.id}`);
        
        // Hash the plain text password
        const hashedPassword = await hashPassword(user.password);
        
        // Update the user's password in the database
        await pool.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        
        console.log(`Successfully migrated password for user ID: ${user.id}`);
      } catch (error) {
        console.error(`Error migrating password for user ID ${user.id}:`, error);
        // Continue with other users even if one fails
      }
    }
    
    console.log('Password migration completed');
  } catch (error) {
    console.error('Error during password migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Check if passwords are already hashed
 */
export async function checkPasswordMigrationStatus(): Promise<{ needsMigration: boolean; totalUsers: number; hashedUsers: number }> {
  try {
    const { rows: totalUsers } = await pool.query(
      'SELECT COUNT(*) as count FROM users'
    );
    
    const { rows: hashedUsers } = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE password LIKE $1',
      ['$2b$%']
    );
    
    const total = parseInt(totalUsers[0].count);
    const hashed = parseInt(hashedUsers[0].count);
    const needsMigration = total > 0 && hashed < total;
    
    return {
      needsMigration,
      totalUsers: total,
      hashedUsers: hashed
    };
  } catch (error) {
    console.error('Error checking migration status:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migratePasswords()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
