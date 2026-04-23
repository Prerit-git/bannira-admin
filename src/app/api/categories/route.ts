import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    // 'category' field ki saari unique values uthayega
    const categories = await Product.distinct("category");
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}