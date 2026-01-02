'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart, type CartItem } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
    setCartCount(cartData.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping: number = 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header cartCount={cartCount} />
        <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-7xl">
          <div className="text-center py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">Add some products to get started</p>
            <Button onClick={() => router.push('/')} className="bg-slate-900 hover:bg-slate-800 h-10 px-6 text-sm sm:text-base">
              Continue Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header cartCount={cartCount} />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 sm:mb-6 h-9 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {cart.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=200'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                            <p className="text-slate-600 font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemove(item.id)}
                                className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs sm:text-sm"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">Remove</span>
                              </Button>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-slate-900 text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        {index < cart.length - 1 && <Separator className="mt-4 sm:mt-6" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white sticky top-20 sm:top-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex justify-between text-slate-600 text-sm sm:text-base">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm sm:text-base">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base sm:text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    size="default"
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
    </div>
  );
}
