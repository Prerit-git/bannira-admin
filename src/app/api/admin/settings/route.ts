import { NextResponse } from 'next/server';
import UISetting from '@/models/UISetting';
import connectToDatabase from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    let settings = await UISetting.findOne({});
    
    if (!settings) {
      settings = await UISetting.create({
        topStripText: [
          "FREE SHIPPING ON ALL ORDERS ABOVE ₹4999",
          "FLAT 10% OFF ON YOUR FIRST PURCHASE | USE CODE: BANNIRA10",
          "NEW FESTIVE KURTI COLLECTION IS NOW LIVE",
          "CASH ON DELIVERY AVAILABLE PAN INDIA"
        ],
        discountCode: "BANNIRA10",
        discountValue: 10,
        shippingCost: 150,
        shippingFreeLimit: 2999,
        gstPercentage: 18,
        heroBanners: [],
        featuredProductIds: [],
        coupons: []
      });
    }
    
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.topStripText !== undefined) updateData.topStripText = body.topStripText;
    if (body.discountCode !== undefined) updateData.discountCode = body.discountCode;
    if (body.discountValue !== undefined) updateData.discountValue = body.discountValue;
    if (body.shippingCost !== undefined) updateData.shippingCost = body.shippingCost;
    if (body.shippingFreeLimit !== undefined) updateData.shippingFreeLimit = body.shippingFreeLimit;
    if (body.gstPercentage !== undefined) updateData.gstPercentage = body.gstPercentage;
    if (body.featuredProductIds !== undefined) updateData.featuredProductIds = body.featuredProductIds;
    
    if (body.heroBanners !== undefined) {
      updateData.heroBanners = body.heroBanners.map((banner: any) => ({
        imageUrl: banner.imageUrl || "",
        mobileImageUrl: banner.mobileImageUrl || "",
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        ctaLink: banner.ctaLink || ""
      }));
    }

    let settings = await UISetting.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: false }
    );

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}