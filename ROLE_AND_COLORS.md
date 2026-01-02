# Role-Based Access Control & Colorful Template

## User Role Management

The application now supports role-based access control with two user types:
- **Admin**: Can access Admin panel and Orders pages
- **Customer**: Can only access Shop and Cart pages

## How It Works

### User Context

A `UserContext` is provided via `hooks/use-user.tsx` that manages user authentication state:
- Stores user data in localStorage
- Provides `isAdmin` boolean to check user role
- Persists user sessions across page reloads

### Admin Toggle Button

A floating button in the bottom-right corner allows you to:
1. Click "Admin Toggle" to reveal the role switcher
2. Toggle between Admin and Customer roles
3. Observe how the navigation changes based on role

**Location**: Bottom-right corner of the page

## Colorful Template Features

The homepage now features a vibrant, modern design:

### Colors & Gradients
- **Background**: Purple-pink-blue gradient (`from-purple-50 via-pink-50 to-blue-50`)
- **Header**: Glassmorphism effect with backdrop blur
- **Logo**: Animated gradient text (`from-purple-600 via-pink-600 to-blue-600`)
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Colorful borders and hover animations

### Product Cards
- Gradient backgrounds on image containers
- "NEW" badge with gradient background
- Color-coded stock indicators:
  - Green gradient: Stock > 10
  - Yellow/Orange gradient: Stock 1-10
  - Red/Pink gradient: Out of stock
- Gradient "Add to Cart" buttons

### Other Enhancements
- Smooth transitions and hover effects
- Card lift animations on hover
- Backdrop blur effects for modern glassmorphism
- Footer with gradient background

## Navigation Changes

### Admin Role
- Shop
- Admin
- Orders
- Cart

### Customer Role
- Shop
- Cart

## Testing Role-Based Access

1. Start the application: `npm run dev`
2. Click the "Admin Toggle" button in the bottom-right corner
3. Toggle between Admin and Customer roles
4. Notice that Admin and Orders links appear/disappear based on the selected role

## Integration with Future Authentication

The user context is designed to integrate with a proper authentication system:

```typescript
// Example: Integration with Supabase Auth
import { supabase } from '@/lib/database';
import { useUser } from '@/hooks/use-user';

const { setUser } = useUser();

// After successful login
const { data: { user } } = await supabase.auth.signInWithPassword({
  email,
  password,
});

const { data: profile } = await supabase
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .single();

setUser({
  id: user.id,
  email: user.email!,
  role: profile.role,
});
```

## Customization

### Colors

Edit `app/page.tsx` to modify color schemes:
- Change gradient colors in `bg-gradient-to-*` classes
- Update button colors in `Button` components

### Animation Speed

Edit `app/globals.css` to adjust the gradient animation:

```css
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

Modify the animation duration in the `.animate-gradient` utility class.
