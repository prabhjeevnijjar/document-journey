import { utapi } from "@/app/server/uploadthing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ message: "Missing file key" }, { status: 400 });
    }

    const result = await utapi.deleteFiles(key);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in file delete handler:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
