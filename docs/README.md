# 🛍️ LogiMart - Modern E-Commerce Frontend

A production-ready, responsive e-commerce frontend built with React, Tailwind CSS, and modern best practices.

## ✨ Features

### 🎯 10 Reusable Components
- **Button** - Multiple variants (primary, secondary, outline, danger)
- **Input** - Form inputs with validation
- **SearchBar** - Keyboard-accessible search
- **CartIcon** - Shopping cart with dropdown
- **NavBar** - Responsive navigation
- **ProductCard** - Individual product display
- **ProductGrid** - Responsive product grid
- **HeroSection** - Customizable banner sections
- **FeatureStrip** - Feature highlights
- **Footer** - Complete footer with links

### 📱 Responsive Design
- Mobile-first approach
- 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
- Touch-friendly on all devices

### 🎨 Modern Styling
- Tailwind CSS for consistent design
- Gradient backgrounds
- Smooth transitions and hover effects
- Professional color palette

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Key Components

```
src/components/
├── Button.jsx          # Reusable button with variants
├── Input.jsx           # Form input component
├── SearchBar.jsx       # Search functionality
├── CartIcon.jsx        # Shopping cart icon
├── NavBar.jsx          # Main navigation bar
├── ProductCard.jsx     # Individual product card
├── ProductGrid.jsx     # Grid layout for products
├── HeroSection.jsx     # Banner/marketing section
├── FeatureStrip.jsx    # Feature highlights
├── Footer.jsx          # Footer component
└── Home.jsx            # Updated home page
```

## 🎨 Design System

**Colors**: Blue (#2563EB) & Cyan (#06B6D4)
**Responsive**: Mobile → Tablet → Desktop
**Accessibility**: ARIA labels, keyboard navigation

## 📚 Documentation

- **COMPONENT_DOCUMENTATION.md** - Detailed component docs
- **QUICK_START.md** - Setup guide
- **EXAMPLES.jsx** - Implementation examples

## 💡 Example Usage

```jsx
// ProductGrid with products
<ProductGrid 
  products={products}
  onAddToCart={(product) => {}}
/>

// Hero section
<HeroSection
  title="Welcome"
  ctaText="Shop Now"
  onCtaClick={() => {}}
/>

// Navigation
<NavBar 
  cartCount={2}
  onSearch={(query) => {}}
/>
```

## 🌟 Key Features

✅ Production-ready code
✅ Mobile-responsive
✅ Accessible components
✅ Modern styling
✅ 10 reusable components
✅ Well documented
✅ Performance optimized

## 📦 Tech Stack

- React 19.2.0
- Tailwind CSS 3.4.19
- Lucide Icons
- Vite 7.2.4
- React Router 7.13.0

---

**Made with ❤️ for LogiMart**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
