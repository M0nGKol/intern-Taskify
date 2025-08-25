"use client";

import { useEffect, useState } from "react";
import { authClient } from "./auth-client";

export interface User {
  id: string;
  email: string;
  name?: string;
  imageURL?: string;
  image?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthenticated(false);
        setUser(null);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch {
      // Ignore sign out errors
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut,
  };
}
