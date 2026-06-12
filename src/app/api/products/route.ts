import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/app/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.images || body.images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    if (!body.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const totalCalculatedQuantity = body.sizeVariants 
      ? Object.values(body.sizeVariants).reduce((a: any, b: any) => Number(a) + Number(b), 0)
      : 0;

    const productData = {
      ...body,
      slug,
      image: body.images[0],
      
      sizeVariants: body.sizeVariants || {}, 
      
      quantity: Number(totalCalculatedQuantity),
      inStock: Number(totalCalculatedQuantity) > 0,
      
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
    };

    const newProduct = await Product.create(productData);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Mongoose Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}