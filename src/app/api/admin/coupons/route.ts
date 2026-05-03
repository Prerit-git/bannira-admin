import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from "@/app/lib/db";
import UISetting from '@/models/UISetting';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { code, discountType, discountValue, minOrderValue, startDate, endDate, usageLimit } = body;

    
    const parsedEndDate = endDate && endDate.trim() !== "" ? new Date(endDate) : undefined;

    const newCoupon = {
      code,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      startDate: new Date(startDate),
      endDate: parsedEndDate,
      usageLimit: usageLimit || undefined,
      usedCount: 0,
      isActive: true,
    };

    let settings = await UISetting.findOne({});
    if (!settings) {
      settings = await UISetting.create({});
    }

    const exists = settings.coupons.some((c: any) => c.code === code.toUpperCase());
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'Coupon with this code already exists.' },
        { status: 400 }
      );
    }

    settings.coupons.push(newCoupon);
    await settings.save();

    return NextResponse.json({ success: true, data: settings.coupons }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
    }

    // Dono (Mongoose Object ID ya Coupon Code String) ko check karega
    await UISetting.updateOne(
      {},
      { 
        $pull: { 
          coupons: { 
            $or: [
              { _id: id },
              { code: id }
            ]
          } 
        } 
      }
    );

    // Update hone ke baad bachi hui coupons ki list bhej dein
    const settings = await UISetting.findOne({});
    
    return NextResponse.json({ success: true, data: settings?.coupons || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}