'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { addToCart, getCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (productData) {
      setProduct(productData);
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', productData.category_id)
          .maybeSingle();
        if (categoryData) setCategory(categoryData);
      }
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
      setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
      toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600 text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-slate-600 mb-4 text-sm sm:text-base">Product not found</p>
          <Button onClick={() => router.push('/')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header cartCount={cartCount} />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 sm:mb-6 h-9 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Card className="overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-slate-100">
                  <img
                    src={product.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            <div>
              {category && (
                <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  {category.name}
                </Badge>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">{product.name}</h1>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">${product.price.toFixed(2)}</p>

              <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">Description</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{product.description || 'No description available.'}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-slate-600 text-sm sm:text-base">
                  <span className="font-semibold">Availability:</span>{' '}
                  {product.stock > 0 ? (
                    <span className="text-green-600">{product.stock} in stock</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="default"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 h-10 sm:h-12 text-sm sm:text-base"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  onClick={() => {
                    handleAddToCart();
                    router.push('/cart');
                  }}
                  disabled={product.stock === 0}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
