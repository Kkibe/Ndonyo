import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter, setDoc, updateDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

export const orderService = {
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
      
      // Update user's orders array
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        orders: arrayUnion({ orderId, total: cart.total, status: 'pending', createdAt: Timestamp.now() })
      });
      
      return { success: true, orderId };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  },
  
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
  
  async getAllOrders(page = 1, pageSize = 50, lastDoc = null) {
    try {
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(pageSize));
      
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
      console.error("Error fetching all orders:", error);
      return { orders: [], hasMore: false, lastDoc: null };
    }
  },
  
  async updateOrderStatus(orderId, status, trackingNumber = null) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData = { status, updatedAt: Timestamp.now() };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      await updateDoc(orderRef, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }
  },
  
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
  }
};