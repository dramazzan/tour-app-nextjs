import {NextRequest, NextResponse} from "next/server";

export function middleware(req : NextRequest){
    const token = req.cookies.get('token')?.value

    if(!token){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const payload = parseJwt(token)

    if(payload.role !== 'admin'){
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

function parseJwt(token: string){
    try{
        const base64 = token.split('.')[1]
        const jsonPayload = Buffer.from(base64, 'base64').toString()
        return JSON.parse(jsonPayload)
    }catch(e){
        console.log(e)
        return {}
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}