import { NextRequest, NextResponse } from "next/server";

function preferMarkdown(accept: string | null): boolean {
    if (!accept) return false;
    let mdQ = 0;
    let htmlQ = 0;
    for (const entry of accept.split(",")) {
        const parts = entry
            .trim()
            .split(";")
            .map((s) => s.trim());
        const type = parts[0].toLowerCase();
        let q = 1;
        for (const p of parts.slice(1)) {
            if (p.startsWith("q=")) q = parseFloat(p.slice(2)) || 0;
        }
        if (type === "text/markdown") mdQ = Math.max(mdQ, q);
        else if (type === "text/html") htmlQ = Math.max(htmlQ, q);
    }
    return mdQ > 0 && mdQ >= htmlQ;
}

function hasMarkdownVersion(pathname: string): boolean {
    if (pathname === "/" || pathname === "/about") return true;
    if (pathname.startsWith("/work/") && pathname.length > "/work/".length) {
        return true;
    }
    return false;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const prefer = preferMarkdown(request.headers.get("accept"));

    if (prefer && hasMarkdownVersion(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === "/" ? "/api/md" : `/api/md${pathname}`;
        const response = NextResponse.rewrite(url);
        response.headers.set("vary", "Accept");
        return response;
    }

    const response = NextResponse.next();
    response.headers.append("vary", "Accept");
    return response;
}

export const config = {
    matcher: ["/((?!api|_next|images|files|.*\\..*).*)"],
};
