import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoggedIn(request: NextRequest) {
    const token = request.cookies.get('tokenAdmin');
    return token !== undefined;
}

export async function middleware(request: NextRequest) {
    if (await isLoggedIn(request)) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: ['/', '/management/:path*']
};
