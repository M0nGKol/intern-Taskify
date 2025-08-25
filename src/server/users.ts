'use server'

import { authClient } from "@/lib/auth-client"

export const getCurrentUser = async () => {
    try {
        return null;
    } catch {
        return null;
    }
}

export const SignOut = async () => {
    try {
        await authClient.signOut();
        return { success: true };
    } catch {
        return { success: false, error: "Failed to sign out" };
    }
};

export const checkAuthStatus = async () => {
    try {
        return {
            isAuthenticated: false,
            user: null
        };
    } catch {
        return {
            isAuthenticated: false,
            user: null
        };
    }
};



