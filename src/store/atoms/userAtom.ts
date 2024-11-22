// recoil/userAtom.ts
import { atom } from 'recoil';
import { selector } from 'recoil';
import axios from 'axios';

// Selector for async data fetching
export const userSelector = selector({
  key: 'userSelector',
  get: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { username: '', email: '' }; // Default for no token

      const response = await axios.get('http://localhost:3000/api/v1/user/', {
        headers: { Authorization: token },
      });

      return response.data.user; // Fetched user data
    } catch (error) {
      console.error('Error fetching user:', error);
      return { username: '', email: '' }; // Default on error
    }
  },
});

// Atom with async default from selector
export const userAtom = atom({
  key: 'userAtom',
  default: {name:"", email:""}, // Use selector as default value
});
