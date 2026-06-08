import { NextResponse } from "next/server";
import businessData from "@/data/businessCompanies.json";
import healthData from "@/data/healthCustomers.json";
import lifestyleData from "@/data/lifestyleCustomers.json";
import {
  analyzeBusiness,
  analyzeHealth,
  analyzeLifestyle,
} from "@/lib/mockAnalysis";
import type {
  BusinessCompany,
  HealthCustomer,
  LifestyleCustomer,
} from "@/lib/types";

type Body = {
  demo: "health" | "lifestyle" | "business";
  customerId: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (body.demo === "health") {
    const c = (healthData as HealthCustomer[]).find(
      (x) => x.id === body.customerId,
    );
    if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(analyzeHealth(c));
  }

  if (body.demo === "lifestyle") {
    const c = (lifestyleData as LifestyleCustomer[]).find(
      (x) => x.id === body.customerId,
    );
    if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(analyzeLifestyle(c));
  }

  if (body.demo === "business") {
    const c = (businessData as BusinessCompany[]).find(
      (x) => x.id === body.customerId,
    );
    if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(analyzeBusiness(c));
  }

  return NextResponse.json({ error: "invalid demo" }, { status: 400 });
}
