# Tea Leaf Green Theme & Mobile Responsiveness

## Overview

The ShopHub e-commerce site has been transformed with a beautiful **Tea Leaf Green** color scheme and enhanced mobile responsiveness.

## Tea Leaf Green Color Scheme

### Primary Colors
- **Green-50 to Green-100**: Light backgrounds (`#F0FDF4`, `#DCFCE7`)
- **Green-500 to Green-600**: Primary actions (`#22C55E`, `#16A34A`)
- **Emerald-500 to Emerald-600**: Secondary accents (`#10B981`, `#059669`)
- **Teal-500 to Teal-600**: Tertiary accents (`#14B8A6`, `#0D9488`)

### Gradients
- **Background**: `from-green-50 via-emerald-50 to-teal-50`
- **Primary**: `from-green-600 via-emerald-600 to-teal-600`
- **Buttons**: `from-green-600 to-emerald-600`
- **Slider**: `from-green-900 via-emerald-900 to-teal-900`

### Color Palette
```css
Lightest: #F0FDF4 (Green-50)
Light:     #DCFCE7 (Green-100) - #A7F3D0 (Emerald-200)
Medium:    #86EFAC (Green-300) - #34D399 (Emerald-400)
Primary:   #22C55E (Green-500) - #10B981 (Emerald-500)
Dark:      #16A34A (Green-600) - #059669 (Emerald-600)
Darker:    #15803D (Green-700) - #047857 (Emerald-700)
Darkest:   #14532D (Green-900) - #064E3B (Emerald-900)
```

## Logo Design

### Logo Component
A custom logo has been added with:
- **Icon**: Leaf icon from Lucide React
- **Container**: Rounded square with gradient background
- **Dimensions**:
  - Mobile: 40x40px (w-10 h-10)
  - Tablet: 48x48px (sm:w-12 sm:h-12)
  - Desktop: 56x56px (md:w-14 md:h-14)
- **Colors**: Green to Emerald gradient (`from-green-500 to-emerald-600`)
- **Icon Size**: Scales with container (24px to 32px)
- **Effects**: Shadow and hover shadow for depth

### Logo + Text
- **Mobile**: Icon only (text hidden)
- **Tablet/Desktop**: Icon + "ShopHub" text
- **Text**: Gradient green text with animation
- **Typography**: Bold, gradient clipping effect

## Mobile Responsiveness

### Responsive Breakpoints

```
xs:  < 640px   (Extra Small)
sm:  640px+    (Small - Mobile landscape)
md:  768px+    (Medium - Tablet)
lg:  1024px+   (Large - Small laptop)
xl:  1280px+   (Extra Large - Desktop)
2xl: 1536px+   (2XL - Large desktop)
```

### Header Responsiveness

**Logo:**
- xs: Icon only (40px)
- sm+: Icon + text (40-56px icon)

**Navigation:**
- xs/sm: Mobile menu (Sheet drawer)
- md/lg: Horizontal nav
- xl+: Horizontal nav with larger gaps

**Cart Button:**
- xs: Icon only with badge
- sm+: "Cart" text + icon
- lg+: Full cart button in nav
- Hidden cart in mobile (separate icon button)

**Padding:**
- xs: 0.75rem (px-3)
- sm: 1rem (px-4)
- md+: 1.5rem (px-6)

### Product Slider

**Height:**
- xs: 300px
- sm: 400px
- md: 500px
- lg: 600px

**Text Sizes:**
- Title: 2xl → 4xl → 5xl → 6xl
- Price: 2xl → 3xl → 4xl
- Description: sm → lg → xl

**Navigation Buttons:**
- xs: 40x40px (h-10 w-10)
- sm+: 48x48px (h-12 w-12)

### Product Grid

**Columns:**
- xs: 1 column
- sm: 2 columns
- lg: 3 columns
- xl: 4 columns

**Card Spacing:**
- xs: gap-4 (1rem)
- sm: gap-6 (1.5rem)
- md+: gap-8 (2rem)

**Card Content:**
- Padding: 1rem → 1.25rem
- Title: lg → xl
- Price: 2xl → 3xl
- Badge: 10px → 12px → 14px
- Button: h-10 → h-12

### Filters Section

**Layout:**
- xs: Vertical stack
- sm+: Horizontal row

**Select Width:**
- xs: Full width
- sm+: Fixed width (200px → 220px)

**Padding:**
- xs: 1rem
- sm+: 1.5rem

### Footer

**Layout:**
- xs: Vertical column
- sm+: Horizontal row

**Padding:**
- xs: 1.5rem vertical
- sm+: 2rem vertical

## Mobile Navigation

### Mobile Menu (Sheet)
- **Width**: 280px (xs) → 320px (sm+)
- **Trigger**: Hamburger menu button
- **Overlay**: Full screen with backdrop
- **Menu Items**: 
  - Font size: 18px (text-lg)
  - Padding: 0.5rem vertical
  - Hover: Light green background
  - Rounded corners

### Touch-Friendly Targets
- **Minimum touch size**: 44x44px
- **Button sizes**: h-10 (40px) to h-12 (48px)
- **Icon buttons**: 40x40px minimum
- **Spacing**: Adequate gap between elements

## Performance Optimizations

### Responsive Images
- Product images use `object-cover` for proper scaling
- Slider images loaded once, reused
- Lazy loading ready (can be added with `loading="lazy"`)

### Layout Shift Prevention
- Fixed aspect ratios for product cards (1:1)
- Consistent padding at all breakpoints
- Reserved space for logo and navigation

### CSS Optimization
- Tailwind's responsive utilities handle all breakpoints
- Minimal custom CSS in globals.css
- Gradient animation uses GPU-accelerated transforms

## Accessibility

### Color Contrast
- Text on green backgrounds: WCAG AA compliant
- Links have hover and focus states
- Focus indicators on all interactive elements

### Semantic HTML
- Proper use of `<header>`, `<main>`, `<footer>`
- Navigation links properly structured
- ARIA labels on buttons with icons

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus order follows visual order
- Skip to content can be added if needed

## Customization

### Changing Colors

To adjust the color scheme, search and replace in your code:

```bash
# Replace primary green
from-purple-600 → from-green-600
to-pink-600 → to-emerald-600

# Replace light backgrounds
from-purple-50 → from-green-50
via-pink-50 → via-emerald-50

# Replace borders
border-purple-100 → border-green-100
```

### Adjusting Breakpoints

Modify responsive classes in `app/page.tsx`:

```tsx
// Example: Make grid 2 columns on tablet
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
// Change to:
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

### Logo Customization

Replace the Leaf icon with your custom logo in `app/page.tsx`:

```tsx
<div className="w-10 h-10 ...">
  <Leaf className="h-6 w-6 ..." />
  {/* Replace with your logo component or img */}
</div>
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- CSS Grid and Flexbox support required
- Backdrop filter support for glass effects
- Gradient text support

## Future Enhancements

Consider adding:
1. Dark mode with darker green shades
2. PWA support for mobile installation
3. Swipe gestures for product slider
4. Product image zoom on mobile
5. Skeleton loading states
6. Progressive enhancement for older browsers
