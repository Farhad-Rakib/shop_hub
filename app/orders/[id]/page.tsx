'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type OrderItemWithProduct = {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
};

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
      fetchOrderItems(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
    if (data) setOrder(data);
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from('order_items')
      .select('id, quantity, price, products(name, image_url)')
      .eq('order_id', orderId);
    if (data) setOrderItems(data as any);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);

    if (!error) {
      setOrder({ ...order, status: newStatus });
      toast({ title: 'Status updated', description: 'Order status has been updated successfully.' });
    } else {
      toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
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
          <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ShopHub
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push('/orders')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Items</CardTitle>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={item.products.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                  alt={item.products.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{item.products.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="font-mono text-sm text-slate-900">{order.id}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500">Order Date</p>
                    <p className="text-slate-900">{new Date(order.created_at).toLocaleString()}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500 mb-2">Order Status</p>
                    <Select value={order.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-lg font-semibold text-slate-900">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="text-slate-900">{order.customer_name}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-900">{order.customer_email}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-slate-900">{order.customer_phone}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500">Shipping Address</p>
                    <p className="text-slate-900 whitespace-pre-line">{order.shipping_address}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="text-slate-900">Cash on Delivery</p>
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
