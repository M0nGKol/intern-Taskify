import z from "zod";
export const SignInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  });

export const SignUpSchema = z.object({
    name: z.string().min(2,"Name must be have at least 2 characters."),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type SignInSchemaValue = z.infer<typeof SignInSchema>;
export type SignUpSchemaValue = z.infer<typeof SignUpSchema>;