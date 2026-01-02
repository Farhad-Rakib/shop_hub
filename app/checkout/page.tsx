'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCart, clearCart, type CartItem } from '@/lib/cart';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const cartData = getCart();
    if (cartData.length === 0) {
      router.push('/cart');
    }
    setCart(cartData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      console.log('Creating order with data:', {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        total_amount: total,
        status: 'pending',
      });

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          total_amount: parseFloat(total.toFixed(2)),
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order insertion error:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', orderData);

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price.toFixed(2)),
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) {
        console.error('Order items insertion error:', itemsError);
        throw itemsError;
      }

      console.log('Order items created successfully');

      clearCart();
      toast({ title: 'Order Placed!', description: 'Your order has been successfully placed.' });

      setTimeout(() => {
        router.push(`/order-confirmation/${orderData.id}`);
      }, 1000);
    } catch (error: any) {
      console.error('Error placing order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to place order. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping: number = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 sm:mb-6 h-9 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="h-10 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="h-10 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        required
                        className="h-10 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm sm:text-base">Shipping Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, City, State, ZIP"
                        rows={3}
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Payment Method</h3>
                      <p className="text-slate-600 text-sm sm:text-base">Cash on Delivery</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">Pay when you receive your order</p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800"
                      size="default"
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white sticky top-20 sm:top-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-slate-600 line-clamp-1 flex-1 mr-2">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium text-slate-900 flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator />
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
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
