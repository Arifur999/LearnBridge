import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  

  const token = request.cookies.get('accessToken')?.value

  const roleHome = (role: string) => {
    if (role === "admin") return "/admin";
    if (role === "trainer" || role === "tutor") return "/tutor/dashboard";
    return "/student";
  }


  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return NextResponse.redirect(new URL(roleHome((decoded.role ?? "").toLowerCase()), request.url))
      } catch {

        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }


  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }


  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Normalize to lowercase — backend returns uppercase ("STUDENT", "TRAINER", "ADMIN")
    const role = (decoded.role ?? "").toLowerCase();

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(roleHome(role), request.url))
    }

    if (pathname.startsWith('/trainer') && role !== 'trainer' && role !== 'tutor') {
      return NextResponse.redirect(new URL(roleHome(role), request.url))
    }

    if (pathname.startsWith('/tutor') && role !== 'trainer' && role !== 'tutor') {
      return NextResponse.redirect(new URL(roleHome(role), request.url))
    }

    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(roleHome(role), request.url))
    }

  } catch {

    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    '/admin/:path*',    
    '/trainer/:path*',  
    '/tutor/:path*',  
    '/student/:path*',  
    '/login',           
    '/register'         
  ],
}
