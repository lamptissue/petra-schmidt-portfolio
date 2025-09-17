import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get("url");
	if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

	const imgRes = await fetch(url);
	if (!imgRes.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });

	const buf = Buffer.from(await imgRes.arrayBuffer());
	// Guess the type; Storyblok can serve webp/avif/jpg — tweak if needed.
	const contentType = imgRes.headers.get("content-type") || "image/webp";
	const base64 = `data:${contentType};base64,${buf.toString("base64")}`;

	return NextResponse.json({ base64 });
}
