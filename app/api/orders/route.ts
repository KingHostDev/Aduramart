import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      delivery_address: body.deliveryAddress,
      delivery_method: body.deliveryMethod,
      payment_method: body.paymentMethod,
      total: body.total,
      status: "placed"
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ orderId: data.id });
}
