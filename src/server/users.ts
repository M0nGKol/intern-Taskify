'use server'

import { authClient } from "@/lib/auth-client"
import { auth } from "@/lib/auth"

export const getCurrentUser = async () => {
    try {
        return null;
    } catch (error) {
        return null;
    }
}

export const SignOut = async () => {
    try {
        await authClient.signOut();
        return { success: true };
    } catch (error) {
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
        return {
            isAuthenticated: false,
            user: null
        };
    }
};



