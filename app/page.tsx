'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, Leaf } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/database';
import { addToCart, getCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ProductSlider } from '@/components/product-slider';
import { useUser } from '@/hooks/use-user';
import { AdminToggle } from '@/components/admin-toggle';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    updateCartCount();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, priceRange]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-50':
          filtered = filtered.filter(p => p.price < 50);
          break;
        case '50-100':
          filtered = filtered.filter(p => p.price >= 50 && p.price < 100);
          break;
        case '100-500':
          filtered = filtered.filter(p => p.price >= 100 && p.price < 500);
          break;
        case 'over-500':
          filtered = filtered.filter(p => p.price >= 500);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    updateCartCount();
    toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
  };

  const updateCartCount = () => {
    const cart = getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 max-w-7xl">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Leaf className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                    ShopHub
                  </span>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                {isAdmin && (
                  <>
                    <Link href="/admin" className="text-slate-700 hover:text-green-600 transition font-medium text-base xl:text-lg">Admin</Link>
                    <Link href="/orders" className="text-slate-700 hover:text-green-600 transition font-medium text-base xl:text-lg">Orders</Link>
                  </>
                )}
                <Link href="/" className="text-slate-700 hover:text-green-600 transition font-medium text-base xl:text-lg">Shop</Link>
                <Link href="/cart" className="relative">
                  <Button variant="outline" size="default" className="shadow-sm hover:shadow-md transition-shadow border-green-200 text-green-700 hover:bg-green-50">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/cart" className="lg:hidden relative">
                  <Button variant="outline" size="sm" className="shadow-sm border-green-200 text-green-700 hover:bg-green-50">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="default" className="border-green-200 text-green-700 hover:bg-green-50">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[280px] sm:w-[320px]">
                    <SheetHeader>
                      <SheetTitle className="text-2xl">Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 mt-8">
                      <Link href="/" className="text-slate-700 hover:text-green-600 font-semibold text-lg py-2 px-3 rounded-lg hover:bg-green-50 transition">Shop</Link>
                      {isAdmin && (
                        <>
                          <Link href="/admin" className="text-slate-700 hover:text-green-600 font-semibold text-lg py-2 px-3 rounded-lg hover:bg-green-50 transition">Admin</Link>
                          <Link href="/orders" className="text-slate-700 hover:text-green-600 font-semibold text-lg py-2 px-3 rounded-lg hover:bg-green-50 transition">Orders</Link>
                        </>
                      )}
                      <Link href="/cart" className="text-slate-700 hover:text-green-600 font-semibold text-lg py-2 px-3 rounded-lg hover:bg-green-50 transition">Cart ({cartCount})</Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
          <div className="mb-6 sm:mb-8">
            <ProductSlider products={products.slice(0, 5)} />
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 tracking-tight">Discover Products</h1>
            <p className="text-slate-600 text-sm sm:text-base">Browse our collection and find what you need</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-green-100">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 h-10 text-sm sm:text-base">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] bg-gradient-to-r from-emerald-50 to-teal-50 border-teal-200 h-10 text-sm sm:text-base">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="over-500">Over $500</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 sm:py-12 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-200">
              <p className="text-slate-500 text-sm sm:text-base">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-green-100 hover:border-emerald-200 rounded-xl sm:rounded-2xl">
                  <CardHeader className="p-0">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                        <img
                          src={product.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-[10px] text-[9px] sm:text-[10px] font-bold shadow-md">
                          NEW
                        </div>
                      </div>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-2.5 sm:p-3 md:p-4">
                    <Link href={`/product/${product.id}`}>
                      <CardTitle className="text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 hover:text-green-600 transition font-semibold line-clamp-1">{product.name}</CardTitle>
                    </Link>
                    <p className="text-slate-600 text-[11px] sm:text-xs md:text-sm line-clamp-2 mb-1.5 sm:mb-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${product.price.toFixed(2)}</p>
                      <p className={`text-[9px] sm:text-[10px] md:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' : product.stock > 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'}`}>
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2.5 sm:p-3 md:p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-8 sm:h-9 md:h-10 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] text-white border-0"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

        <footer className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 mt-8 sm:mt-12 text-white">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
              <Leaf className="h-4 w-4" />
              <p className="text-xs sm:text-sm md:text-base">&copy; 2026 ShopHub. All rights reserved.</p>
              <Leaf className="h-4 w-4 hidden sm:block" />
            </div>
          </div>
        </footer>
      </div>
      <AdminToggle />
      <Toaster />
    </>
  );
}
