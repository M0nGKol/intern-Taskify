import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
 
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7,
    },
    cookies: {
        sessionToken: {
            name: "session-token",
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        },
    },
});