import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Product Categories
export const CATEGORIES = {
  FOOTWEAR: 'footwear',
  APPAREL: 'apparel',
  ACCESSORIES: 'accessories',
  EQUIPMENT: 'equipment',
  TRAINING: 'training',
  FAN_GEAR: 'fan_gear'
};

// Add these user-related functions to your existing marketplace.service.js

// User Service (Add these to your existing marketplace.service.js)
export const userService = {
  async getUser(email) {
    try {
      const userDoc = await getDoc(doc(db, 'users', email));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  async updateUser(email, data) {
    try {
      const userRef = doc(db, 'users', email);
      await updateDoc(userRef, { ...data, updatedAt: Timestamp.now() });
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  },

  async createUser(email, username, isPremium = false) {
    try {
      const userRef = doc(db, 'users', email);
      await setDoc(userRef, {
        email,
        username,
        isPremium,
        subscription: null,
        subDate: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        transactions: [],
        orders: [],
        wishlist: []
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: error.message };
    }
  },

  async getAllUsers(page = 1, pageSize = 20, filters = {}, lastDoc = null, searchTerm = '') {
    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      
      if (filters.isPremium !== undefined) {
        q = query(q, where('isPremium', '==', filters.isPremium));
      }
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      const users = [];
      let lastVisible = null;
      
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
      });
      
      // Apply client-side search if needed
      let filteredUsers = users;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredUsers = users.filter(user =>
          user.email?.toLowerCase().includes(search) ||
          user.username?.toLowerCase().includes(search) ||
          user.subscription?.toLowerCase().includes(search)
        );
      }
      
      return { 
        users: filteredUsers, 
        hasMore: users.length === pageSize,
        lastDoc: lastVisible 
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], hasMore: false, lastDoc: null };
    }
  }
};

// Product Service
export const productService = {
  // Get all products with pagination and filtering
  async getProducts(page = 1, pageSize = 12, filters = {}, lastDoc = null) {
    try {
      let q = query(collection(db, 'products'))//, orderBy('createdAt', 'desc'));
      
      // Apply category filter
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      // Apply price range filter
      if (filters.minPrice !== undefined) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }
      
      // Apply inStock filter
      if (filters.inStock !== undefined) {
        q = query(q, where('inStock', '==', filters.inStock));
      }
      
      // Apply sorting
      if (filters.sortBy) {
        const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';
        q = query(q, orderBy(filters.sortBy, sortOrder));
      }
      
      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      const products = [];
      let lastVisible = null;
      
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
      });
      
      return { products, hasMore: products.length === pageSize, lastDoc: lastVisible };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], hasMore: false, lastDoc: null };
    }
  },
  
  // Get single product by ID
  async getProduct(productId) {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
  
  // Get featured products
  async getFeaturedProducts(limit = 6) {
    try {
      const q = query(
        collection(db, 'products'),
        where('featured', '==', true),
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      const products = [];
      snapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));
      return products;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },
  
  // Search products
  async searchProducts(searchTerm, pageSize = 20, lastDoc = null) {
    try {
      const searchLower = searchTerm.toLowerCase();
      let q = query(
        collection(db, 'products'),
        orderBy('name'),
        where('searchTerms', 'array-contains', searchLower),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const products = [];
      let lastVisible = null;
      
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
      });
      
      return { products, hasMore: products.length === pageSize, lastDoc: lastVisible };
    } catch (error) {
      console.error("Error searching products:", error);
      return { products: [], hasMore: false, lastDoc: null };
    }
  },
  
  // Get products by category
  async getProductsByCategory(category, pageSize = 12, lastDoc = null) {
    return this.getProducts(1, pageSize, { category }, lastDoc);
  },
  
  // Admin: Add new product
  async addProduct(productData) {
    try {
      const productRef = doc(collection(db, 'products'));
      const searchTerms = [
        productData.name.toLowerCase(),
        productData.category.toLowerCase(),
        ...(productData.tags || []).map(t => t.toLowerCase())
      ];
      
      await setDoc(productRef, {
        ...productData,
        searchTerms,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        salesCount: 0,
        rating: 0,
        reviews: []
      });
      return { success: true, id: productRef.id };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Admin: Update product
  async updateProduct(productId, productData) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Admin: Delete product
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Update stock
  async updateStock(productId, quantity) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        stock: increment(quantity),
        inStock: quantity > 0
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating stock:", error);
      return { success: false, error: error.message };
    }
  }
};

// Cart Service
export const cartService = {
  // Get user's cart
  async getCart(userId) {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        return { id: cartDoc.id, ...cartDoc.data() };
      }
      return { items: [], total: 0 };
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { items: [], total: 0 };
    }
  },
  
  // Add item to cart
  async addToCart(userId, productId, quantity = 1, size = null, color = null) {
    try {
      const cartRef = doc(db, 'carts', userId);
      const product = await productService.getProduct(productId);
      if (!product || product.stock < quantity) {
        return { success: false, error: 'Product out of stock' };
      }
      
      const cartDoc = await getDoc(cartRef);
      let items = [];
      
      if (cartDoc.exists()) {
        items = cartDoc.data().items || [];
        const existingItem = items.find(item => 
          item.productId === productId && item.size === size && item.color === color
        );
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          items.push({
            productId,
            name: product.name,
            price: product.price,
            quantity,
            size,
            color,
            image: product.images?.[0] || '',
            seller: product.seller
          });
        }
      } else {
        items = [{
          productId,
          name: product.name,
          price: product.price,
          quantity,
          size,
          color,
          image: product.images?.[0] || '',
          seller: product.seller
        }];
      }
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await setDoc(cartRef, {
        userId,
        items,
        total,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
      return { success: true, cart: { items, total } };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Update cart item quantity
  async updateCartItem(userId, productId, quantity, size = null, color = null) {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (!cartDoc.exists()) {
        return { success: false, error: 'Cart not found' };
      }
      
      let items = cartDoc.data().items || [];
      const itemIndex = items.findIndex(item => 
        item.productId === productId && item.size === size && item.color === color
      );
      
      if (itemIndex === -1) {
        return { success: false, error: 'Item not found in cart' };
      }
      
      if (quantity <= 0) {
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].quantity = quantity;
      }
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await updateDoc(cartRef, { items, total, updatedAt: Timestamp.now() });
      return { success: true, cart: { items, total } };
    } catch (error) {
      console.error("Error updating cart:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Remove item from cart
  async removeFromCart(userId, productId, size = null, color = null) {
    return this.updateCartItem(userId, productId, 0, size, color);
  },
  
  // Clear cart
  async clearCart(userId) {
    try {
      const cartRef = doc(db, 'carts', userId);
      await setDoc(cartRef, { items: [], total: 0, updatedAt: Timestamp.now() }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    }
  }
};

// Order Service
export const orderService = {
  // Create order from cart
  async createOrder(userId, cart, shippingDetails, paymentMethod) {
    try {
      const orderRef = doc(collection(db, 'orders'));
      const orderId = orderRef.id;
      
      const order = {
        orderId,
        userId,
        items: cart.items,
        total: cart.total,
        shippingDetails,
        paymentMethod,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        trackingNumber: null,
        estimatedDelivery: null
      };
      
      await setDoc(orderRef, order);
      
      // Clear cart after order
      await cartService.clearCart(userId);
      
      // Update product stock
      const batch = writeBatch(db);
      for (const item of cart.items) {
        const productRef = doc(db, 'products', item.productId);
        batch.update(productRef, {
          stock: increment(-item.quantity),
          salesCount: increment(item.quantity)
        });
      }
      await batch.commit();
      
      return { success: true, orderId };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Get user's orders
  async getUserOrders(userId, page = 1, pageSize = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const orders = [];
      let lastVisible = null;
      
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
      });
      
      return { orders, hasMore: orders.length === pageSize, lastDoc: lastVisible };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], hasMore: false, lastDoc: null };
    }
  },
  
  // Get single order
  async getOrder(orderId) {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        return { id: orderDoc.id, ...orderDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },
  
  // Update order status (Admin)
  async updateOrderStatus(orderId, status, trackingNumber = null) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData = { status, updatedAt: Timestamp.now() };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      await updateDoc(orderRef, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating order:", error);
      return { success: false, error: error.message };
    }
  }
};

// Wishlist Service
export const wishlistService = {
  async getWishlist(userId) {
    try {
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistDoc = await getDoc(wishlistRef);
      if (wishlistDoc.exists()) {
        return wishlistDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  },
  
  async addToWishlist(userId, productId) {
    try {
      const product = await productService.getProduct(productId);
      if (!product) return { success: false, error: 'Product not found' };
      
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistDoc = await getDoc(wishlistRef);
      
      let items = [];
      if (wishlistDoc.exists()) {
        items = wishlistDoc.data().items || [];
        if (!items.some(item => item.productId === productId)) {
          items.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            addedAt: Timestamp.now()
          });
        }
      } else {
        items = [{
          productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          addedAt: Timestamp.now()
        }];
      }
      
      await setDoc(wishlistRef, { userId, items, updatedAt: Timestamp.now() });
      return { success: true };
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return { success: false, error: error.message };
    }
  },
  
  async removeFromWishlist(userId, productId) {
    try {
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistDoc = await getDoc(wishlistRef);
      if (wishlistDoc.exists()) {
        let items = wishlistDoc.data().items || [];
        items = items.filter(item => item.productId !== productId);
        await updateDoc(wishlistRef, { items, updatedAt: Timestamp.now() });
      }
      return { success: true };
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false, error: error.message };
    }
  }
};