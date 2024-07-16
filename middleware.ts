import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/',
]);

export default clerkMiddleware((auth, request) => {
  if(isProtectedRoute(request)) {
    auth().protect(); 
  }

  return NextResponse.next();
})


export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

/** 
 * By default, clerkMiddleware will not protect any routes. 
 * All routes are public and you must opt-in to protection for routes.
 */
