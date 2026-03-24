/**
 * Help Service - Provides AI-powered responses based on user role and query
 * Simulates intelligent assistant responses for different user types
 */

const helpResponses = {
  // General/Welcome responses
  greetings: {
    hello: "Hey! 👋 I'm here to help. How can I assist you today?",
    hi: "Hello! 😊 What can I help you with?",
    help: "I'm here to help! You can ask me about orders, products, account, payments, and more. What do you need?",
    default: "I'm your friendly e-commerce assistant! How can I help you today?"
  },

  // Customer specific
  customer: {
    orders: "📦 **Your Orders** - You can view all your orders, track shipments, and check delivery status. Go to your dashboard > Orders section!",
    "my orders": "📦 To view your orders, click on **My Orders** in your dashboard. You'll see order status, tracking info, and estimated delivery dates.",
    "order status": "🔍 **Track Your Order** - Click on any order to see real-time tracking, delivery status, and estimated arrival date.",
    track: "🚚 To track your order, visit your **Dashboard > Orders** and click on the order you want to track. You'll see live updates!",
    wishlist: "❤️ **Wishlist** - You can save products to your wishlist! Click the heart icon on any product to save it for later.",
    cart: "🛒 **Shopping Cart** - Items you add to cart are saved. Go to **Cart** to review, update quantities, or proceed to checkout.",
    checkout: "💳 **Checkout** - Review your items, enter delivery address, select payment method, and place your order. It's quick and secure!",
    payment: "💰 **Payment Methods** - We accept credit cards, debit cards, UPI, and Cash on Delivery (COD). All payments are secure and encrypted.",
    "address": "📍 **Saved Addresses** - You can save multiple delivery addresses in your profile for faster checkout next time.",
    "profile": "👤 **Account Settings** - Update your profile, change password, manage addresses, and preferences in your dashboard.",
    return: "↩️ **Returns & Refunds** - You can initiate returns within 7 days. Go to **Orders > Select Order > Return** to start the process.",
    return: "❓ **Need Help with Something Else?** - Feel free to ask about orders, products, payments, or your account. I'm here to help! 😊"
  },

  // Seller specific
  seller: {
    earnings: "💰 **Your Earnings** - Check your dashboard for daily, weekly, and monthly earnings. You'll see all transaction details and commissions.",
    orders: "📦 **Manage Orders** - View new orders, pack and ship items, track shipments. Go to **Seller Dashboard > Orders**.",
    shipping: "🚚 **Ship Orders** - Once you ship an order, update the status in your dashboard. Customers will receive tracking info automatically.",
    products: "📝 **Manage Products** - Add, edit, or remove products from your store. Update inventory, prices, and details anytime.",
    "add product": "➕ **Add Product** - Go to **Seller Dashboard > Add Product**. Fill in details, upload images, set price and stock, then publish!",
    inventory: "📊 **Inventory Management** - Keep track of stock levels. Low stock items get flagged with alerts so you don't miss sales!",
    ratings: "⭐ **Reviews & Ratings** - Monitor customer feedback and ratings on your products. Respond to reviews to build trust.",
    payout: "💳 **Payouts** - View pending payouts, payout history, and settlement dates in your dashboard's Payments section.",
    "settlement": "📅 **Payment Settlement** - Payouts are processed weekly. Check your dashboard for settlement status and dates.",
    support: "🆘 **Support** - Have questions about selling? Check the Help section or contact our support team for guidance.",
    default: "🤔 **Seller Support** - Ask me about managing products, orders, earnings, payouts, or anything else related to your store!"
  },

  // Admin specific
  admin: {
    dashboard: "📊 **Admin Dashboard** - View all platform metrics, user stats, sales data, and important alerts in one place.",
    sales: "💹 **Sales Analytics** - Monitor daily, weekly, and monthly sales. Check total revenue, top products, and sales trends.",
    users: "👥 **User Management** - View all customers, sellers, and admins. Monitor user activity and manage account statuses.",
    orders: "📦 **Order Management** - Oversee all orders across the platform. Monitor order statuses, process disputes, and handle cancellations.",
    products: "📝 **Product Management** - Manage all products, categories, inventory, and pricing across all sellers.",
    sellers: "🏪 **Seller Management** - Approve sellers, monitor performance, manage commissions, and handle violations.",
    payments: "💰 **Payment Processing** - Track all transactions, settlements, failed payments, and manage payment methods.",
    alerts: "⚠️ **Alerts & Issues** - Get notified about low stock, delayed orders, payment failures, and other critical issues.",
    reports: "📈 **Reports** - Generate detailed reports on sales, users, products, and platform performance.",
    settings: "⚙️ **Platform Settings** - Configure payment methods, shipping zones, commissions, taxes, and other platform settings.",
    default: "👨‍💼 **Admin Support** - Ask me about user management, sales analytics, order processing, payments, or platform configuration!"
  },

  // Common responses
  common: {
    "thank you": "You're welcome! 😊 Is there anything else I can help you with?",
    thanks: "Happy to help! 🙂 Let me know if you need anything else.",
    "no thanks": "No problem! Feel free to ask if you need help later. Happy shopping! 🛍️",
    "i don't know": "No worries! Feel free to ask any specific questions, or I can guide you through features like orders, products, or your account.",
    bye: "Thanks for chatting! Goodbye! 👋",
    "see you": "See you soon! Feel free to reach out anytime you need help. 😊"
  }
};

/**
 * Get the user's role from context
 * Tries to detect from localStorage or returns 'customer' as default
 */
const getUserRole = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      const role = userData.role || 'customer';
      return role.toLowerCase();
    }
  } catch (error) {
    console.log('Could not determine user role, using default customer');
  }
  return 'customer';
};

/**
 * Main AI response function
 * Analyzes user query and provides contextual help based on role
 */
export const generateAIResponse = async (userMessage) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const query = userMessage.toLowerCase().trim();
  const userRole = getUserRole();

  // Check common responses first
  for (const [key, response] of Object.entries(helpResponses.common)) {
    if (query.includes(key)) {
      return response;
    }
  }

  // Check role-specific responses
  const roleResponses = helpResponses[userRole] || helpResponses.customer;
  for (const [key, response] of Object.entries(roleResponses)) {
    if (query.includes(key)) {
      return response;
    }
  }

  // Keyword matching for broader queries
  if (query.includes('order') || query.includes('delivery') || query.includes('shipment')) {
    if (userRole === 'seller') return roleResponses.orders || "📦 Go to your **Seller Dashboard > Orders** to manage and track all orders.";
    if (userRole === 'admin') return roleResponses.orders || "📦 Access **Admin Dashboard > Orders** to view and manage all platform orders.";
    return roleResponses.orders || "📦 Check your **Dashboard > Orders** to view order history, status, and tracking info.";
  }

  if (query.includes('product') || query.includes('listing') || query.includes('catalog')) {
    if (userRole === 'seller') return roleResponses.products || "📝 Manage your products in **Seller Dashboard > Products**. Add, edit, or remove items anytime!";
    if (userRole === 'admin') return roleResponses.products || "📝 View all products in **Admin Dashboard > Products**. Manage inventory and categories.";
    return "🛍️ Browse our **Shop** to discover amazing products! Use filters to find exactly what you need.";
  }

  if (query.includes('payment') || query.includes('checkout') || query.includes('pay')) {
    if (userRole === 'seller') return roleResponses.payout || "💳 Check your **Seller Dashboard > Payments** for earnings, pending payouts, and transaction history.";
    if (userRole === 'admin') return roleResponses.payments || "💰 Manage payments in **Admin Dashboard > Payments**. Monitor transactions and settlements.";
    return roleResponses.payment || "💳 We accept multiple payment methods. All transactions are secure and encrypted!";
  }

  if (query.includes('earning') || query.includes('revenue') || query.includes('payout')) {
    if (userRole === 'seller') return roleResponses.earnings || "💰 View your earnings in **Seller Dashboard > Earnings**. Track all your sales and commissions!";
    if (userRole === 'admin') return roleResponses.sales || "💹 Check **Admin Dashboard > Sales** for platform revenue, trends, and analytics.";
    return "💰 For earnings info, check your seller dashboard or account statements.";
  }

  if (query.includes('account') || query.includes('profile') || query.includes('settings')) {
    if (userRole === 'seller') return "👤 Update your seller profile in **Settings**. Add payment info, business details, and bank account.";
    if (userRole === 'admin') return "⚙️ Configure platform settings in **Admin Panel > Settings**.";
    return roleResponses.profile || "👤 Manage your account in **Dashboard > Account Settings**. Update profile, password, and addresses.";
  }

  if (query.includes('help') || query.includes('support') || query.includes('issue') || query.includes('problem')) {
    return "🆘 I'm here to help! You can ask me about orders, products, payments, accounts, and more. What specifically do you need help with?";
  }

  // Role-specific default response
  if (userRole === 'seller') {
    return "🤔 I didn't quite understand that. Feel free to ask about **orders, products, earnings, payouts, or anything else about managing your store!** 😊";
  }
  if (userRole === 'admin') {
    return "🤔 I didn't quite understand that. Ask me about **users, sales, orders, products, payments, or platform management!** 👨‍💼";
  }
  return "🤔 I didn't quite catch that. Feel free to ask about **orders, products, wishlist, cart, payments, or your account!** 😊";
};

export default {
  generateAIResponse,
  getUserRole,
};
