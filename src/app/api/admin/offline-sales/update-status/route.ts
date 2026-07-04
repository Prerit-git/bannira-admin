import connectToDatabase from "@/app/lib/db";
import OfflineSale from "@/models/OfflineSale";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { invoiceNumber, status } = body;

    if (!invoiceNumber || !status) {
      return NextResponse.json({ error: "Missing invoiceNumber or status" }, { status: 400 });
    }

    const updatedSale = await OfflineSale.findOneAndUpdate(
      { invoiceNumber },
      { orderStatus: status },
      { new: true }
    );

    if (!updatedSale) {
      return NextResponse.json({ error: "Offline invoice record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, sale: updatedSale }, { status: 200 });
  } catch (error: any) {
    console.error("Offline Status Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}