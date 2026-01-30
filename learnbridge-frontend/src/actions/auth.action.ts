"use server";

import { authService } from "@/services/auth.service";

interface LoginActionState {
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

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    };
  }
};
