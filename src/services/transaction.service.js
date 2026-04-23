import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const transactionService = {
  async getUserTransactions(userEmail, page = 1, pageSize = 10) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userEmail));
      if (!userDoc.exists()) return { transactions: [], hasMore: false };
      
      const userData = userDoc.data();
      const transactions = userData.transactions || [];
      const reversed = [...transactions].reverse();
      const start = (page - 1) * pageSize;
      const paginated = reversed.slice(start, start + pageSize);
      
      return { 
        transactions: paginated, 
        hasMore: start + pageSize < transactions.length 
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { transactions: [], hasMore: false };
    }
  },
  
  async addTransaction(userEmail, transaction) {
    try {
      const userRef = doc(db, 'users', userEmail);
      const newTransaction = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...transaction,
        createdAt: Timestamp.now()
      };
      await updateDoc(userRef, {
        transactions: arrayUnion(newTransaction)
      });
      return { success: true, transaction: newTransaction };
    } catch (error) {
      console.error("Error adding transaction:", error);
      return { success: false, error: error.message };
    }
  }
};