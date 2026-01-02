'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

export function AdminToggle() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, setUser } = useUser();

  const toggleAdmin = () => {
    if (user?.role === 'admin') {
      setUser({ id: 'customer-1', email: 'customer@example.com', role: 'customer' });
    } else {
      setUser({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
    }
  };

  if (!showLogin) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowLogin(true)}
        className="text-xs text-slate-400 hover:text-green-600"
      >
        Admin Toggle
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={toggleAdmin}
        variant={user?.role === 'admin' ? 'default' : 'outline'}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        {user?.role === 'admin' ? 'Switch to Customer' : 'Switch to Admin'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLogin(false)}
      >
        Close
      </Button>
    </div>
  );
}
