import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";

// GET: Fetch all products for the table
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all products, sorted by newest first (createdAt: -1)
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // 1. Backend Validation
    if (!body.images || body.images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    if (!body.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // 2. Slug Generation (URL friendly name)
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // 3. Prepare Data (Syncing with your Model)
    const productData = {
      ...body,
      slug,
      image: body.images[0], // Main thumbnail for singular 'image' field
      inStock: Number(body.quantity) > 0,
      price: Number(body.price),
      quantity: Number(body.quantity),
      // Handle originalPrice only if it's a valid number
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      // Ensure sizes is an array
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
    };

    const newProduct = await Product.create(productData);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Mongoose Error:", error.message);
    // Return specific error message if validation fails
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}