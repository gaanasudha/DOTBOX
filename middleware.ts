import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { url } from 'inspector';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([ 
    "/api/videos"
])

export default clerkMiddleware((auth, req) => {
    const {userId} = auth();
    const currentUrl = new URL(req.url)
    const isHomePage = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    //if user is logged in
    if(userId && isPublicRoute(req) && !isHomePage){
        return NextResponse.redirect(new URL("/home", req.url))
    }

    //if user is not logged in
    if(!userId){

        //if the user is not accessing the public api or public route, redirect to signin page
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        //if the user is accessing the public api but not public api route, redirect to signin page
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        return NextResponse.next()
    }
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*))"
  ],
};