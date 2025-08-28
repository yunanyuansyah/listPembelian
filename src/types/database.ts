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
