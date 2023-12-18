import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const a = request.cookies;

    if (a.has('token')) {
        if (a.get('token')?.value === 'password') {
            return NextResponse.next();
        }
    }
    return
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/management/:router*', '/']
};
