import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// User Profile Operations
export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Debt Operations
export const addDebt = async (userId, debtData) => {
  const debtsRef = collection(db, 'users', userId, 'debts');
  const newDebt = {
    ...debtData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId: userId // Adding explicit user reference
  };
  return addDoc(debtsRef, newDebt);
};

export const updateDebt = async (userId, debtId, updates) => {
  const debtRef = doc(db, 'users', userId, 'debts', debtId);
  await updateDoc(debtRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteDebt = async (userId, debtId) => {
  const debtRef = doc(db, 'users', userId, 'debts', debtId);
  await deleteDoc(debtRef);
};

export const getUserDebts = async (userId) => {
  const debtsRef = collection(db, 'users', userId, 'debts');
  const debtsSnap = await getDocs(debtsRef);
  return debtsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Payment Operations
export const addPayment = async (userId, debtId, paymentData) => {
  const paymentsRef = collection(db, 'users', userId, 'debts', debtId, 'payments');
  const newPayment = {
    ...paymentData,
    createdAt: serverTimestamp(),
    debtId: debtId,
    userId: userId // Adding explicit user reference
  };
  return addDoc(paymentsRef, newPayment);
};

export const getDebtPayments = async (userId, debtId) => {
  const paymentsRef = collection(db, 'users', userId, 'debts', debtId, 'payments');
  const paymentsSnap = await getDocs(paymentsRef);
  return paymentsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Chat History Operations
export const saveChatMessage = async (userId, message) => {
  const chatRef = doc(db, 'users', userId, 'chat', 'history');
  await updateDoc(chatRef, {
    messages: arrayUnion({
      ...message,
      timestamp: serverTimestamp()
    })
  });
};

export const createChatSession = async (userId) => {
  const chatRef = doc(db, 'users', userId, 'chat', 'history');
  await setDoc(chatRef, {
    messages: [],
    createdAt: serverTimestamp()
  });
}; 