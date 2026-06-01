import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

// Helper for generating category slugs
const generateSlug = (name: string) => {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
};

// 1. READ: Saari categories fetch karna aur unke unique products calculate karna
export async function GET() {
  await connectToDatabase();
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const products = await Product.find({}, "category");

    // Automatically count how many products exist in DB for each category string/id
    const formattedCategories = categories.map((cat) => {
      const productCount = products.filter(
        (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
      ).length;

      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        productCount,
      };
    });

    return NextResponse.json({ success: true, data: formattedCategories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. CREATE: Nayi Category add karna
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });

    const slug = generateSlug(name);
    const newCategory = await Category.create({ name, slug });
    
    return NextResponse.json({ success: true, data: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Category already exists or server error" }, { status: 500 });
  }
}

// 3. UPDATE & DELETE: Id operations ke liye handler mapping inside route parameters config
export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id, name } = await req.json();
    const slug = generateSlug(name);
    const updated = await Category.findByIdAndUpdate(id, { name, slug }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const { url } = req;
    const id = new URL(url).searchParams.get("id");
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}