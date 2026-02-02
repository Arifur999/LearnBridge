"use server";

import { authService } from "@/services/auth.service";
import { cookies } from "next/headers"; 


export interface LoginActionState {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    user: {
      id: string;
      role: string;
      email: string;
    };
  };
}

export const loginAction = async (
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    const result = await authService.login({
      email: email.toString(),
      password: password.toString(),
    });

 
    if (result?.data?.accessToken) {
      const cookieStore = await cookies();
      
      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, 
        sameSite: "strict",
      });
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Login failed",
    };
  }
};


export interface SignupActionState {
  success: boolean;
  message?: string;
}

export const signupAction = async (
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    await authService.signup({
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Signup failed",
    };
  }
};