import { Pool } from 'pg';
import { ListPembelian, User } from '@/types/database';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Re-export types for backward compatibility
export type { ListPembelian, User };

// Get all products
export async function getAllProducts(): Promise<ListPembelian[]> {
  try {
    const { rows } = await pool.query<ListPembelian>(
      'SELECT * FROM listPembelian ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Get product by ID
export async function getProductById(id: number): Promise<ListPembelian | null> {
  try {
    const { rows } = await pool.query<ListPembelian>(
      'SELECT * FROM listPembelian WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

// Create new product
export async function createProduct(product: Omit<ListPembelian, 'id' | 'created_at'>): Promise<ListPembelian> {
  try {
    console.log('Creating product with data:', product);
    console.log('Data types:', {
      nama: typeof product.nama,
      deskripsi: typeof product.deskripsi,
      harga: typeof product.harga,
      stok: typeof product.stok,
      total_harga: typeof product.total_harga
    });
    
    const { rows } = await pool.query<ListPembelian>(
      'INSERT INTO listPembelian (nama, deskripsi, harga, stok, total_harga, image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [product.nama, product.deskripsi, product.harga, product.stok, product.total_harga, product.image_path]
    );
    
    console.log('Product created successfully:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      product: product
    });
    
    // Check if it's a database constraint error
    if (error instanceof Error && error.message.includes('violates')) {
      throw new Error(`Database constraint error: ${error.message}`);
    }
    
    throw new Error('Failed to create product');
  }
}

// Update product
export async function updateProduct(id: number, product: Partial<Omit<ListPembelian, 'id' | 'created_at'>>): Promise<ListPembelian> {
  try {
    console.log('Updating product with data:', product);
    console.log('Data types:', {
      nama: typeof product.nama,
      deskripsi: typeof product.deskripsi,
      harga: typeof product.harga,
      stok: typeof product.stok,
      total_harga: typeof product.total_harga,
      image_path: typeof product.image_path
    });
    
    const { rows } = await pool.query<ListPembelian>(
      'UPDATE listPembelian SET nama = COALESCE($1, nama), deskripsi = COALESCE($2, deskripsi), harga = COALESCE($3, harga), stok = COALESCE($4, stok), total_harga = COALESCE($5, total_harga), image_path = COALESCE($6, image_path) WHERE id = $7 RETURNING *',
      [product.nama, product.deskripsi, product.harga, product.stok, product.total_harga, product.image_path, id]
    );
    
    console.log('Product updated successfully:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      product: product
    });
    
    // Check if it's a database constraint error
    if (error instanceof Error && error.message.includes('violates')) {
      throw new Error(`Database constraint error: ${error.message}`);
    }
    
    throw new Error('Failed to update product');
  }
}

// Delete product
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM listPembelian WHERE id = $1',
      [id]
    );
    return (rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Search products
export async function searchProducts(query: string): Promise<ListPembelian[]> {
  try {
    const { rows } = await pool.query<ListPembelian>(
      'SELECT * FROM listPembelian WHERE nama ILIKE $1 OR deskripsi ILIKE $1 ORDER BY created_at DESC',
      [`%${query}%`]
    );
    return rows;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

// ========== USER MANAGEMENT FUNCTIONS ==========

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user');
  }
}

// Create new user
export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    // Import password utilities
    const { hashPassword } = await import('./auth/password');
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(user.password);
    
    const { rows } = await pool.query<User>(
      'INSERT INTO users (nama, email, password, nomor, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.nama, user.email, hashedPassword, user.nomor, user.status]
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Update user
export async function updateUser(id: number, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User> {
  try {
    let hashedPassword = user.password;
    
    // If password is being updated, hash it
    if (user.password) {
      const { hashPassword } = await import('./auth/password');
      hashedPassword = await hashPassword(user.password);
    }
    
    const { rows } = await pool.query<User>(
      'UPDATE users SET nama = COALESCE($1, nama), email = COALESCE($2, email), password = COALESCE($3, password), nomor = COALESCE($4, nomor), status = COALESCE($5, status), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [user.nama, user.email, hashedPassword, user.nomor, user.status, id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Delete user
export async function deleteUser(id: number): Promise<boolean> {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return (rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// Update user status (admin/mods/user)
export async function updateUserStatus(id: number, status: 'admin' | 'mods' | 'user'): Promise<User> {
  try {
    console.log(`Updating user ${id} status to ${status}`);
    
    const { rows } = await pool.query<User>(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (rows.length === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    console.log(`Successfully updated user ${id} status to ${status}`);
    return rows[0];
  } catch (error) {
    console.error('Error updating user status:', error);
    console.error('Error details:', {
      userId: id,
      newStatus: status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error('Failed to update user status');
  }
}

// Get users by status
export async function getUsersByStatus(status: 'admin' | 'mods' | 'user'): Promise<User[]> {
  try {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching users by status:', error);
    throw new Error('Failed to fetch users by status');
  }
}

// ========== AUTHENTICATION & AUTHORIZATION FUNCTIONS ==========

// Check if user is admin
export async function isAdmin(userId: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user?.status === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Check if user is moderator
export async function isModerator(userId: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user?.status === 'mods';
  } catch (error) {
    console.error('Error checking moderator status:', error);
    return false;
  }
}

// Check if user is admin or moderator
export async function isAdminOrModerator(userId: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user?.status === 'admin' || user?.status === 'mods';
  } catch (error) {
    console.error('Error checking admin/moderator status:', error);
    return false;
  }
}

// Check if user has permission (admin or specific user)
export async function hasPermission(userId: number, targetUserId?: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    if (!user) return false;
    
    // Admin has all permissions
    if (user.status === 'admin') return true;
    
    // User can only access their own data
    if (targetUserId && user.id === targetUserId) return true;
    
    return false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

// Get user without password (for public profile)
export async function getUserProfile(id: number): Promise<Omit<User, 'password'> | null> {
  try {
    const { rows } = await pool.query<Omit<User, 'password'>>(
      'SELECT id, nama, email, nomor, status, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

// Verify user credentials
export async function verifyUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return null;
    
    // Import password utilities
    const { comparePassword } = await import('./auth/password');
    
    // Compare the provided password with the stored hash
    const isPasswordValid = await comparePassword(password, user.password);
    if (isPasswordValid) {
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw new Error('Failed to verify user');
  }
}
