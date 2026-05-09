import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    if (token && token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { 
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/orders/:path*", "/products/:path*", "/settings/:path*"] 
};