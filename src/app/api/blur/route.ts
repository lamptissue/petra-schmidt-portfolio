import { NextResponse } from "next/server";

const blurCache = new Map<string, string>();

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get("url");
	if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

	const cached = blurCache.get(url);
	if (cached) {
		return NextResponse.json(
			{ base64: cached },
			{
				headers: {
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			}
		);
	}

	const imgRes = await fetch(url);
	if (!imgRes.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });

	const buf = Buffer.from(await imgRes.arrayBuffer());

	const contentType = imgRes.headers.get("content-type") || "image/webp";
	const base64 = `data:${contentType};base64,${buf.toString("base64")}`;

	blurCache.set(url, base64);

	return NextResponse.json(
		{ base64 },
		{
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		}
	);
}
