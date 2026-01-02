'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setOrder(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Order not found</p>
          <Button onClick={() => router.push('/')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            ShopHub
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="font-mono text-slate-900">{order.id}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-500">Customer Information</p>
                <div className="mt-2 space-y-1">
                  <p className="text-slate-900">{order.customer_name}</p>
                  <p className="text-slate-600">{order.customer_email}</p>
                  <p className="text-slate-600">{order.customer_phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-500">Shipping Address</p>
                <p className="text-slate-900 mt-2 whitespace-pre-line">{order.shipping_address}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-500">Payment Method</p>
                <p className="text-slate-900 mt-2">Cash on Delivery</p>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-slate-900">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button onClick={() => router.push('/')} className="bg-slate-900 hover:bg-slate-800">
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
