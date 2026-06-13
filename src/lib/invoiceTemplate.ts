export function generateInvoiceHTML(order: any, type: "GST" | "NON-GST") {
  const isGST = type === "GST";
  const subtotal = order.subtotal || 0;
  const tax = isGST ? (order.tax || 0) : 0;
  const shipping = order.shippingCharge || 0;
  const discount = order.discount || 0;
  const total = isGST ? (order.totalAmount || 0) : (subtotal + shipping - discount);

  const logoUrl = "https://res.cloudinary.com/dvmpnsfpo/image/upload/v1781348458/bannira_web_logo_o9zrjh.png";

  const itemsHtml = order.items.map((item: any, i: number) => `
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 12px; font-size: 11px; text-align: left;">${i + 1}</td>
      <td style="padding: 12px; font-size: 11px; text-align: left; font-weight: bold;">${item.name}</td>
      <td style="padding: 12px; font-size: 11px; text-align: center;">${item.size}</td>
      <td style="padding: 12px; font-size: 11px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; font-size: 11px; text-align: right; font-family: monospace;">₹${item.price.toLocaleString()}</td>
      <td style="padding: 12px; font-size: 11px; text-align: right; font-family: monospace;">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; background: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
        <tr>
          <td style="vertical-align: middle;">
            <img src="${logoUrl}" alt="BANNIRA" style="max-width: 160px; height: auto; object-fit: contain; display: block; margin-bottom: 6px;" />
            <p style="font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 4px 0 0 0;">
              ${isGST ? "Tax Invoice" : "Cash Memo (Non-GST)"}
            </p>
          </td>
          <td style="text-align: right; font-size: 12px; line-height: 1.6; color: #555;">
            <strong>BANNIRA STORE</strong><br/>
            123, Manufacturing Hub, Industrial Area,<br/>
            Delhi, India - 110001<br/>
            ${isGST ? "<strong>PAN/GSTIN:</strong> 07AAAAA0000A1Z2" : ""}
          </td>
        </tr>
      </table>

      <hr style="border: 0; border-top: 1px solid #e8e8e8; margin-bottom: 30px;" />

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px; font-size: 12px; line-height: 1.6;">
        <tr>
          <td width="50%" style="vertical-align: top;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #999; margin: 0 0 5px 0;">Billing & Shipping To:</p>
            <strong>${order.shippingAddress?.fullName || "Guest Customer"}</strong><br/>
            Phone: +91 ${order.shippingAddress?.phone || order.phone || "N/A"}<br/>
            Email: ${order.shippingAddress?.email || "N/A"}<br/>
            Address: ${order.shippingAddress?.address || "N/A"}, ${order.shippingAddress?.area || ""}, ${order.shippingAddress?.state || ""}<br/>
            Pincode: ${order.shippingAddress?.pincode || "N/A"}<br/>
            ${isGST && order.shippingAddress?.gstNumber ? `<strong style="color: #7B2D0A;">Buyer GSTIN: ${order.shippingAddress.gstNumber}</strong>` : ""}
          </td>
          <td width="50%" style="text-align: right; vertical-align: top;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #999; margin: 0 0 5px 0;">Description:</p>
            <strong>Invoice No:</strong> #BAN-${order._id.slice(-6).toUpperCase()}<br/>
            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-GB')}<br/>
            <strong>Payment Method:</strong> <span style="text-transform: uppercase;">${order.paymentMethod || "Cash"}</span><br/>
            <strong>Payment Status:</strong> ${order.paymentStatus || "Pending"}
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #fcfcfc; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; font-weight: bold; font-size: 10px; text-transform: uppercase; color: #555;">
            <th style="padding: 12px; text-align: left; width: 8%;">S.No</th>
            <th style="padding: 12px; text-align: left; width: 42%;">Item Name</th>
            <th style="padding: 12px; text-align: center; width: 10%;">Size</th>
            <th style="padding: 12px; text-align: center; width: 10%;">Qty</th>
            <th style="padding: 12px; text-align: right; width: 15%;">Rate</th>
            <th style="padding: 12px; text-align: right; width: 15%;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; line-height: 2;">
        <tr>
          <td width="60%"></td>
          <td width="40%">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color: #666;">Subtotal:</td>
                <td style="text-align: right; font-family: monospace;">₹${subtotal.toLocaleString()}</td>
              </tr>
              ${discount > 0 ? `<tr><td style="color: #22c55e;">Discount:</td><td style="text-align: right; font-family: monospace; color: #22c55e;">- ₹${discount.toLocaleString()}</td></tr>` : ""}
              ${isGST ? `<tr><td style="color: #666;">Integrated GST (${order.tax ? "Included" : "18%"}):</td><td style="text-align: right; font-family: monospace;">₹${tax.toLocaleString()}</td></tr>` : ""}
              <tr>
                <td style="color: #666;">Shipping & Delivery:</td>
                <td style="text-align: right; font-family: monospace;">${shipping === 0 ? "FREE" : `₹${shipping.toLocaleString()}`}</td>
              </tr>
              <tr style="border-top: 1px solid #e8e8e8; font-size: 14px; font-weight: bold;">
                <td style="padding-top: 10px; color: #7B2D0A;">Grand Total:</td>
                <td style="padding-top: 10px; text-align: right; font-family: monospace; color: #7B2D0A; font-size: 16px;">₹${total.toLocaleString()}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="margin-top: 60px; border-top: 1px solid #f0f0f0; padding-top: 20px; text-align: center; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
        Thank you for choosing Bannira Store
      </div>
    </div>
  `;
}