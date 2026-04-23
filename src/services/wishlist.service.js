import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

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
  
  async addToWishlist(userId, product) {
    try {
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistDoc = await getDoc(wishlistRef);
      
      let items = [];
      if (wishlistDoc.exists()) {
        items = wishlistDoc.data().items || [];
        if (!items.some(item => item.productId === product.id)) {
          items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            addedAt: Timestamp.now()
          });
        }
      } else {
        items = [{
          productId: product.id,
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