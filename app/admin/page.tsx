'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Package, FolderOpen } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function Admin() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Product deleted', description: 'Product has been successfully deleted.' });
      fetchProducts();
    } else {
      toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Category deleted', description: 'Category has been successfully deleted.' });
      fetchCategories();
    } else {
      toast({ title: 'Error', description: 'Failed to delete category.', variant: 'destructive' });
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                ShopHub Admin
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Shop</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-8">Admin Panel</h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-white mb-4 sm:mb-6">
              <TabsTrigger value="products" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-4 sm:mt-6">
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">Products</CardTitle>
                  <Button onClick={() => router.push('/admin/products/new')} className="bg-slate-900 hover:bg-slate-800 h-9 px-4 text-sm sm:text-base">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Image</TableHead>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Category</TableHead>
                          <TableHead className="text-xs sm:text-sm">Price</TableHead>
                          <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                          <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-xs sm:text-sm">{product.name}</TableCell>
                            <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{getCategoryName(product.category_id)}</TableCell>
                            <TableCell className="text-xs sm:text-sm">${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{product.stock}</TableCell>
                            <TableCell>
                              <div className="flex gap-1.5 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/admin/products/${product.id}`)}
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                >
                                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0">
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription className="text-sm sm:text-base">
                                        Are you sure you want to delete this product? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="text-sm sm:text-base">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="text-sm sm:text-base">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-4 sm:mt-6">
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">Categories</CardTitle>
                  <Button onClick={() => router.push('/admin/categories/new')} className="bg-slate-900 hover:bg-slate-800 h-9 px-4 text-sm sm:text-base">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Slug</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map(category => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{category.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{category.slug}</TableCell>
                          <TableCell>
                            <div className="flex gap-1.5 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/categories/${category.id}`)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0">
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm sm:text-base">
                                      Are you sure you want to delete this category? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="text-sm sm:text-base">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="text-sm sm:text-base">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </>
  );
}
