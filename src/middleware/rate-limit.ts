import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(request: NextRequest, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  const rateLimitInfo = rateLimitMap.get(ip);
  
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return NextResponse.next();
  }
  
  if (rateLimitInfo.count >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  rateLimitInfo.count++;
  return NextResponse.next();
}
