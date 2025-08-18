'use server'

import { authClient } from "@/lib/auth-client"
import { auth } from "@/lib/auth"

export const getCurrentUser = async () => {
    try {
        return null;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export const SignOut = async () => {
    try {
        await authClient.signOut();
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        return { success: false, error: "Failed to sign out" };
    }
};

export const checkAuthStatus = async () => {
    try {
        return {
            isAuthenticated: false,
            user: null
        };
    } catch (error) {
        console.error("Error checking auth status:", error);
        return {
            isAuthenticated: false,
            user: null
        };
    }
};



