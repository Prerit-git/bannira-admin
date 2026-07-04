import connectToDatabase from "@/app/lib/db";
import OfflineSale from "@/models/OfflineSale";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerName, customerPhone, customerGst, sellThrough, items, subtotal, discount, tax, totalAmount, paymentMode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No products added to invoice grid." }, { status: 400 });
    }

    // 1. Check stock availability for all items before writing to DB
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 404 });

      let sizeVariantsObj = typeof product.sizeVariants?.toJSON === 'function' ? product.sizeVariants.toJSON() : product.sizeVariants || {};
      const currentStock = sizeVariantsObj[item.size] !== undefined ? Number(sizeVariantsObj[item.size]) : 0;

      if (currentStock < Number(item.quantity)) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name} (Size: ${item.size}). Available: ${currentStock}` }, { status: 400 });
      }
    }

    // 2. Generate unique sequential manual invoice token string
    const invoiceNumber = `OFF-${Date.now().toString().slice(-6).toUpperCase()}`;

    // 3. Save Offline Sale Document
    const newSale = await OfflineSale.create({
      invoiceNumber,
      customerName,
      customerPhone,
      customerGst,
      sellThrough,
      items,
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMode,
    });

    // 4. CRITICAL INVENTORY SYNC: Decrement sizes inventory instantly
    const inventoryPromises = items.map((item: any) => {
      const sizeFieldPath = `sizeVariants.${item.size}`;
      return Product.findByIdAndUpdate(item.productId, {
        $inc: {
          quantity: -Number(item.quantity),
          [sizeFieldPath]: -Number(item.quantity),
        },
      });
    });
    await Promise.all(inventoryPromises);

    return NextResponse.json({ success: true, sale: newSale }, { status: 201 });

  } catch (error: any) {
    console.error("Offline Sales API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET handler connected directly to OfflineSale model collection
export async function GET() {
  try {
    await connectToDatabase();
    const offlineSales = await OfflineSale.find({}).sort({ createdAt: -1 });
    return NextResponse.json(offlineSales, { status: 200 });
  } catch (error: any) {
    console.error("Offline Sales GET API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}