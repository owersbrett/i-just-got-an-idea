'use client';
import { createContext, ReactNode, useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth"; // Assuming you have imported the necessary types for Firebase Auth
import { auth } from "../../../firebase/clientApp";

interface UserContextType {
  user: User | null;
  uid: string | null;
}

const initialUserContext: UserContextType = {
  user: null,
  uid: null,
};

export const UserContext = createContext<UserContextType>(initialUserContext);

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [uid, setuid] = useState<string | null>(null);

  useEffect(() => {
    // Add your code to listen for changes in the user authentication state
    // and update the user and uid accordingly

    // For example, using the `onAuthStateChanged` function from Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setuid(user.uid);
      } else {
        setUser(null);
        setuid(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, uid }}>
      {children}
    </UserContext.Provider>
  );
}
