import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Online order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    console.error("Online Status Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}