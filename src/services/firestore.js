import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
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

// Chat History Operations
export const saveChatMessage = async (userId, message) => {
  const chatRef = doc(db, 'chats', userId);
  await updateDoc(chatRef, {
    messages: arrayUnion({
      ...message,
      timestamp: serverTimestamp()
    })
  });
};

export const createChatSession = async (userId) => {
  const chatRef = doc(db, 'chats', userId);
  await setDoc(chatRef, {
    messages: [],
    createdAt: serverTimestamp()
  });
};

// Financial Data Operations
export const saveFinancialData = async (userId, data) => {
  const financeRef = doc(db, 'finances', userId);
  await setDoc(financeRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getFinancialData = async (userId) => {
  const financeRef = doc(db, 'finances', userId);
  const financeSnap = await getDoc(financeRef);
  return financeSnap.exists() ? financeSnap.data() : null;
}; 