export interface Product {
  id: number;
  nama: string;
  harga: number;
  image: string;
  kategori: string;
  deskripsi: string;
  stok: number;

}

export const products: Product[] = [
  {
    id: 1,
    nama: "MacBook Pro 16-inch",
    harga: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    kategori: "Laptop",
    deskripsi: "Powerful laptop with M3 Pro chip, perfect for professionals and creators.",
    stok: 15,
  },
  {
    id: 2,
    nama: "iPhone 15 Pro",
    harga: 999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    kategori: "Smartphone",
    deskripsi: "Latest iPhone with titanium design and advanced camera system.",  
    stok: 8,
 
  },
  {
    id: 3,
    nama: "Sony WH-1000XM5",
    harga: 399,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
    kategori: "Headphones",
    deskripsi: "Industry-leading noise canceling wireless headphones.",
    stok: 25
  },
  {
    id: 4,
    nama: "Samsung 4K Monitor",
    harga: 599,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop",
    kategori: "Monitor",
    deskripsi: "32-inch 4K UHD monitor with HDR support and USB-C connectivity.",
    stok: 12,

  },
  {
    id: 5,
    nama: "Logitech MX Master 3S",
    harga: 99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    kategori: "Mouse",
    deskripsi: "Advanced wireless mouse with precision tracking and ergonomic design.",
    stok: 30
  },
  {
    id: 6,
    nama: "Mechanical Keyboard RGB",
    harga: 149,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
    kategori: "Keyboard",
    deskripsi: "Gaming mechanical keyboard with RGB backlighting and tactile switches.",
    stok: 18,
  },
  {
    id: 7,
    nama: "iPad Air 5th Gen",
    harga: 599,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    kategori: "Tablet",
    deskripsi: "Powerful tablet with M1 chip, perfect for creativity and productivity.",
    stok: 0
  },
  {
    id: 8,
    nama: "Apple Watch Series 9",
    harga: 399,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    kategori: "Smartwatch",
    deskripsi: "Advanced smartwatch with health monitoring and fitness tracking.",
    stok: 22,
  }
];
