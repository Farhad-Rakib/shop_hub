'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/hooks/use-user';

interface HeaderProps {
  cartCount: number;
}

export function Header({ cartCount }: HeaderProps) {
  const { isAdmin } = useUser();

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Leaf className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl sm:text-2xl md:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ShopHub
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 sm:gap-5 md:gap-6">
            {isAdmin && (
              <>
                <Link href="/admin" className="text-slate-700 hover:text-green-600 transition font-medium text-sm sm:text-base">Admin</Link>
                <Link href="/orders" className="text-slate-700 hover:text-green-600 transition font-medium text-sm sm:text-base">Orders</Link>
              </>
            )}
          </nav>

          <nav className="hidden lg:flex items-center gap-3 sm:gap-4">
            <Link href="/" className="text-slate-700 hover:text-green-600 transition font-medium text-sm sm:text-base">Shop</Link>
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow border-green-200 text-green-700 hover:bg-green-50 h-9 px-3 sm:px-4">
                <ShoppingCart className="h-4 w-4 sm:mr-2 mr-1" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="lg:hidden relative">
              <Button variant="outline" size="sm" className="shadow-sm border-green-200 text-green-700 hover:bg-green-50 h-9 w-9 p-0">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-3 mt-6">
                  <Link href="/" className="text-slate-700 hover:text-green-600 font-semibold text-base py-2 px-3 rounded-lg hover:bg-green-50 transition">Shop</Link>
                  {isAdmin && (
                    <>
                      <Link href="/admin" className="text-slate-700 hover:text-green-600 font-semibold text-base py-2 px-3 rounded-lg hover:bg-green-50 transition">Admin</Link>
                      <Link href="/orders" className="text-slate-700 hover:text-green-600 font-semibold text-base py-2 px-3 rounded-lg hover:bg-green-50 transition">Orders</Link>
                    </>
                  )}
                  <Link href="/cart" className="text-slate-700 hover:text-green-600 font-semibold text-base py-2 px-3 rounded-lg hover:bg-green-50 transition">Cart ({cartCount})</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
