import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // Закрываем всё, что начинается с /app
  if (url.pathname.startsWith("/app")) {
    const keyFromQuery = url.searchParams.get("key");
    const keyFromCookie = req.cookies.get("parlee_invite")?.value;

    const INVITE_KEY = process.env.INVITE_KEY;

    // Если ключ верный — ставим cookie и пропускаем
    if (INVITE_KEY && (keyFromQuery === INVITE_KEY || keyFromCookie === INVITE_KEY)) {
      const res = NextResponse.next();

      // если пришли по ссылке ?key=..., закрепим доступ кукой
      if (keyFromQuery === INVITE_KEY && keyFromCookie !== INVITE_KEY) {
        res.cookies.set("parlee_invite", INVITE_KEY, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 дней
        });
      }

      return res;
    }

    // Иначе — редирект на главную
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Важно: чтобы мидлварь работала только на /app/*
export const config = {
  matcher: ["/app/:path*"],
};
