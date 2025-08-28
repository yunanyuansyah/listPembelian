import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: false, // Set to true if you need SSL in production
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export interface ListPembelian {
  id: number;
  nama: string;
  deskripsi: string | null;
  harga: number | null;
  stok: number;
  total_harga: number | null;
  created_at: Date;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  nomor: string;
  status: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

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
    const { rows } = await pool.query<ListPembelian>(
      'INSERT INTO listPembelian (nama, deskripsi, harga, stok, total_harga) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product.nama, product.deskripsi, product.harga, product.stok, product.total_harga]
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// Update product
export async function updateProduct(id: number, product: Partial<Omit<ListPembelian, 'id' | 'created_at'>>): Promise<ListPembelian> {
  try {
    const { rows } = await pool.query<ListPembelian>(
      'UPDATE listPembelian SET nama = COALESCE($1, nama), deskripsi = COALESCE($2, deskripsi), harga = COALESCE($3, harga), stok = COALESCE($4, stok), total_harga = COALESCE($5, total_harga) WHERE id = $6 RETURNING *',
      [product.nama, product.deskripsi, product.harga, product.stok, product.total_harga, id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
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
    return rowCount > 0;
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
    const { rows } = await pool.query<User>(
      'INSERT INTO users (nama, email, password, nomor, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.nama, user.email, user.password, user.nomor, user.status]
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
    const { rows } = await pool.query<User>(
      'UPDATE users SET nama = COALESCE($1, nama), email = COALESCE($2, email), password = COALESCE($3, password), nomor = COALESCE($4, nomor), status = COALESCE($5, status), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [user.nama, user.email, user.password, user.nomor, user.status, id]
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
    return rowCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// Update user status (admin/user)
export async function updateUserStatus(id: number, status: 'admin' | 'user'): Promise<User> {
  try {
    const { rows } = await pool.query<User>(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Failed to update user status');
  }
}

// Get users by status
export async function getUsersByStatus(status: 'admin' | 'user'): Promise<User[]> {
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
    
    // Note: In production, you should hash the password and compare with stored hash
    // For now, this is a simple comparison (NOT SECURE for production)
    if (user.password === password) {
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw new Error('Failed to verify user');
  }
}
