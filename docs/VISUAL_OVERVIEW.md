# 🎨 LogiMart Visual Component Overview

## Component Hierarchy

```
Layout
├── NavBar
│   ├── Logo/Brand
│   ├── Navigation Links
│   ├── SearchBar
│   │   ├── Input
│   │   └── Icon
│   ├── CartIcon
│   │   ├── Badge
│   │   └── MiniCart (Dropdown)
│   │       ├── Items List
│   │       ├── ProductCard (in cart)
│       └── Buttons
│   └── Button (Login/Logout)
│
├── Main Content (Pages)
│   ├── Home
│   │   ├── HeroSection (3x)
│   │   │   ├── Icon
│   │   │   ├── Text Content
│   │   │   ├── Image
│   │   │   └── Button
│   │   ├── FeatureStrip
│   │   │   └── 4 Feature Items
│   │   ├── ProductGrid
│   │   │   └── ProductCard (6x)
│   │   │       ├── Image
│   │   │       ├── Category Tag
│   │   │       ├── Name
│   │   │       ├── Rating & Reviews
│   │   │       ├── Price
│   │   │       └── Button
│   │   └── Newsletter Section
│   │       ├── Input (Email)
│   │       └── Button (Subscribe)
│   │
│   ├── Shop
│   │   └── ProductGrid
│   │       └── ProductCard (many)
│   │
│   ├── Orders
│   │   └── (Your structure)
│   │
│   └── Contact
│       └── (Your structure)
│
└── Footer
    ├── Brand Section
    │   ├── Logo
    │   └── Description
    ├── Links Section
    │   ├── Company Links
    │   ├── Support Links
    │   ├── Legal Links
    │   └── Shop Links
    ├── Contact Section
    │   ├── Email
    │   ├── Phone
    │   └── Address
    ├── Social Links
    │   ├── Facebook
    │   ├── Twitter
    │   ├── Instagram
    │   └── LinkedIn
    ├── Newsletter Section
    └── Copyright
```

---

## Component Usage Flow

### 🏠 Home Page
```
HOME PAGE
    ↓
HeroSection #1 (Worldwide Logistics)
    ↓
HeroSection #2 (Smart E-Commerce)
    ↓
HeroSection #3 (Trusted by Millions)
    ↓
FeatureStrip (Free Shipping, etc.)
    ↓
ProductGrid
    ├─ ProductCard #1
    ├─ ProductCard #2
    ├─ ProductCard #3
    ├─ ProductCard #4
    ├─ ProductCard #5
    └─ ProductCard #6
    ↓
Newsletter Section
```

### 🛍️ Shop Page
```
SHOP PAGE
    ↓
Filters (optional)
    ↓
ProductGrid
    ├─ ProductCard #1
    ├─ ProductCard #2
    ├─ ProductCard #3
    ├─ ...
    └─ ProductCard #N
    ↓
Pagination (optional)
```

### 🛒 Cart Flow
```
USER INTERACTION
    ↓
Click CartIcon (NavBar)
    ↓
MiniCart Dropdown Opens
    ├─ Show Items
    ├─ Remove Items
    └─ "Go to Cart" Button
    ↓
View Full Cart Page
    ├─ List All Items
    ├─ Edit Quantities
    ├─ Remove Items
    └─ Checkout Button
```

---

## Responsive Layout Breakdown

### 📱 Mobile View (< 640px)
```
┌─────────────────────────┐
│  [L] LogiMart  [☰]      │  NavBar
├─────────────────────────┤
│                         │
│   [Responsive Hero]     │  HeroSection
│   Full width           │
│                         │
├─────────────────────────┤
│   [Feature Strip]       │  FeatureStrip
│   Stacked vertically    │
├─────────────────────────┤
│   [Product 1]           │  ProductGrid
│   (1 column)            │  1 column
│   [Product 2]           │
│   [Product 3]           │
│   [Product 4]           │
│   [Product 5]           │
│   [Product 6]           │
├─────────────────────────┤
│   [Footer content]      │  Footer
│   Stacked              │
└─────────────────────────┘
```

### 💻 Tablet View (640px - 1024px)
```
┌──────────────────────────────────────┐
│  [L] LogiMart     [Search] [🛒] [Login] │ NavBar
├──────────────────────────────────────┤
│                                      │
│  [Hero Text]      [Hero Image]       │ HeroSection
│                                      │  Side-by-side
├──────────────────────────────────────┤
│ Feature 1    Feature 2 Feature 3 F4  │ FeatureStrip
│              (2x2 grid)              │
├──────────────────────────────────────┤
│ [Product 1] [Product 2] [Product 3]  │ ProductGrid
│ (2-3 per row)                        │
│ [Product 4] [Product 5] [Product 6]  │
├──────────────────────────────────────┤
│  Company    Support  Legal   Shop    │ Footer
│  Links      Links    Links   Links   │
│             Social Media             │
└──────────────────────────────────────┘
```

### 🖥️ Desktop View (1024px+)
```
┌────────────────────────────────────────────────────────┐
│ [L] LogiMart    [Full Search Bar]  [🛒] [Login]      │ NavBar
├────────────────────────────────────────────────────────┤
│                                                        │
│ [Hero]  [Image]    [Hero]  [Image]    [Hero] [Image] │ HeroSections
│ #1                 #2                  #3             │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Feat1    Feat2    Feat3    Feat4                      │ FeatureStrip
│        (4 in one row)                                 │
├────────────────────────────────────────────────────────┤
│ [P1]  [P2]  [P3]  [P4]                                │ ProductGrid
│ (3-4 per row)                                         │
│ [P5]  [P6]  ...                                       │
├────────────────────────────────────────────────────────┤
│ Company    Support    Legal    Shop    Social Media   │ Footer
│ Links      Links      Links    Links   Icons          │
│                                                        │
│                  © 2026 LogiMart                       │
└────────────────────────────────────────────────────────┘
```

---

## Component Details

### 🔘 Button Component
```
┌─────────────────────┐
│ Primary Button      │  Solid blue background
└─────────────────────┘  Hover: darker blue
                        Active: scale down
                        Disabled: gray, opacity

┌─────────────────────┐
│ Secondary Button    │  Gray background
└─────────────────────┘  

┌─────────────────────┐
│ Outline Button      │  Border only, no fill
└─────────────────────┘

┌─────────────────────┐
│ Danger Button       │  Red background
└─────────────────────┘
```

### 🎨 ProductCard Layout
```
┌──────────────────────────┐
│ ┌─────────────────────┐  │
│ │                     │  │
│ │    Product Image    │  │
│ │   (Hover: zoom)     │  │
│ │                     │  │
│ ├─────────────────────┤  │
│ │ Category Tag (blue) │  │
│ │                     │  │
│ │ Product Name        │  │
│ │                     │  │
│ │ ★★★★☆ (328 reviews)│  │
│ │                     │  │
│ │ ₹99,999             │  │
│ │ ₹125,000 (strikethrough) │
│ │                     │  │
│ │ [Add to Cart Button]│  │
│ └─────────────────────┘  │
│         ❤️ (Wishlist)     │
│    [15% OFF Badge]       │
└──────────────────────────┘
```

### 🎯 HeroSection Layout
```
LEFT LAYOUT:
┌──────────────────────────────────────┐
│ Title            [Image with glow]   │
│ Subtitle                             │
│ Description                          │
│ [CTA Button]                        │
└──────────────────────────────────────┘

CENTER LAYOUT:
┌──────────────────────────────────────┐
│           [Icon]                     │
│         Title Center                 │
│         Subtitle Center              │
│         Description Center           │
│       [CTA Button] Center            │
└──────────────────────────────────────┘

RIGHT LAYOUT:
┌──────────────────────────────────────┐
│ [Image with glow]    Title           │
│                      Subtitle        │
│                      Description     │
│                      [CTA Button]    │
└──────────────────────────────────────┘
```

### 🔍 SearchBar Component
```
┌──────────────────────────────────────┐
│ 🔍 Search products...          [✕]  │
└──────────────────────────────────────┘
   ▲                              ▲
   Icon                      Clear button
   (appears when typing)
```

### 🛒 CartIcon with Dropdown
```
┌────────────┐
│ 🛒    [2]  │  ← CartIcon in NavBar
└────────────┘
      │
      ▼
  ┌─────────────────────────┐
  │ Shopping Cart           │
  ├─────────────────────────┤
  │ [Item 1 Image]          │
  │ Product Name     ₹Price │
  │ Qty: 1         [Delete] │
  ├─────────────────────────┤
  │ [Item 2 Image]          │
  │ Product Name     ₹Price │
  │ Qty: 1         [Delete] │
  ├─────────────────────────┤
  │ Total: ₹XXXXX           │
  │ [Go to Cart Button]     │
  └─────────────────────────┘
```

### 📊 ProductGrid Responsive
```
MOBILE (1 column):
[Product]
[Product]
[Product]
[Product]

TABLET (2 columns):
[Product] [Product]
[Product] [Product]

DESKTOP (3-4 columns):
[P] [P] [P] [P]
[P] [P] [P] [P]
```

---

## Styling Reference

### Color States

#### Button Colors
```
Primary:   #2563EB → #1E40AF (hover)
Secondary: #D1D5DB → #9CA3AF (hover)
Outline:   border-blue-600, text-blue-600
Danger:    #DC2626 → #991B1B (hover)
```

#### ProductCard States
```
Normal:    white background, light shadow
Hover:    shadow-lg, image zoom 1.05
Active:   scale down slightly
Wishlist: red heart on toggle
```

#### FeatureStrip
```
Background: blue-600 to cyan-500 gradient
Text: white
Icons: emoji (customizable)
```

---

## Animation Effects

### Used Throughout
```
Transitions:
- duration-300: Most hover effects
- duration-500: Slider transitions
- duration-1000: Hero section fades

Transforms:
- hover:scale-110: Buttons, icons
- hover:scale-105: Product images
- hover:translateY(-8px): Product cards
- hover:shadow-xl: Hover shadows

Animations:
- animate-spin: Loading states
- opacity transitions: Fade effects
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab:    Navigate through elements
Enter:  Activate buttons, submit forms
Space:  Toggle buttons
Esc:    Close dropdowns (when implemented)
Arrow:  Navigate in lists (when implemented)
```

### Screen Reader Support
```
aria-label on all icons
Semantic HTML tags
Form labels properly associated
ARIA roles on custom components
Color not the only indicator
```

---

## Mobile Menu Structure

```
Desktop NavBar:
[Logo] [Nav Links] [Search] [Cart] [Login]

Mobile NavBar:
[Logo]                    [Cart] [Login] [☰]

Mobile Menu Open:
[Logo]                    [Cart] [Login] [✕]
├─ [Search Bar]
├─ Home
├─ Shop
├─ Orders
└─ Contact
```

---

## Footer Structure

```
┌────────────────────────────────────────────┐
│ Brand   │ Company │ Support │ Legal │ Shop │
│ Info    │ Links   │ Links   │ Links │ Links
├────────────────────────────────────────────┤
│ Email          │ Phone           │ Address │
└────────────────────────────────────────────┘
  [Facebook] [Twitter] [Instagram] [LinkedIn]
            © 2026 LogiMart
```

---

**This visual overview helps understand how all components fit together! 🎨**
