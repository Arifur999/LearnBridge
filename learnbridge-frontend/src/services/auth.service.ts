import { API_BASE_URL } from "@/lib/config";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "accessToken";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "trainer" | "student";
  name?: string;
  exp: number;
}

class AuthService {
  // 1. LOGIN
  async login(payload: LoginPayload) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    
    const data = await res.json();

    console.log("Login Response Data:", data); 

    if (!res.ok) throw new Error(data?.message || "Login failed");

    if (data?.data?.accessToken) {
      Cookies.set(TOKEN_KEY, data.data.accessToken, { expires: 7, path: '/' });
    } else {
      console.error("Access Token not found in response!");
    }
    
    return data;
  }


  async signup(payload: SignupPayload) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Signup failed");

    if (data?.data?.accessToken) {
   
      Cookies.set(TOKEN_KEY, data.data.accessToken, { expires: 7, path: '/' });
    }
    
    return data;
  }


  logout() {

    Cookies.remove(TOKEN_KEY, { path: '/' });
    window.location.href = "/login";
  }


  getCurrentUser() {
    const token = Cookies.get(TOKEN_KEY);
    
    if (!token) return null;
    
    try {
      const decoded: DecodedToken = jwtDecode(token);

      
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.logout();
        return null;
      }

      return {
        name: decoded.name || "User",
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
   
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();