"use server";
import { SignInSchemaValue, SignUpSchemaValue, SignUpSchema } from "@/lib/schema/auth";
import { SignInSchema } from "@/lib/schema/auth";
const fakeData =[
    {
    email: "admin@gmail.com",
    password: "admin",
  },
  {
    email: "user@gmail.com",
    password: "user",
  },
];
async function credentialsSignIn(values: SignInSchemaValue) {
  const { data, error } = await SignInSchema.safeParse(values);
  if (!data || error) {
    return { data: null, message: "Invalid credentials" };
  }
  const user = fakeData.find(
    (user) => user.email === data.email && user.password === data.password
  );
  if (!user) {
    return { data: null, message: "Invalid credentials" };
  }
  return { data: user, message: "Login successful" };
}

async function credentialsSignUp(values: SignUpSchemaValue) {
  const { data, error } = await SignUpSchema.safeParse(values);
  if (!data || error) {
    return { data: null, message: "Invalid sign up data" };
  }
  

  const existingUser = fakeData.find(user => user.email === data.email);
  if (existingUser) {
    return { data: null, message: "User with this email already exists" };
  }

  const newUser = {
    email: data.email,
    password: data.password,
    name: data.name,
  };
  
  fakeData.push(newUser);
  
  return { data: newUser, message: "Account created successfully" };
}

export { credentialsSignIn, credentialsSignUp };
