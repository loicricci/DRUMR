import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@drumr/db";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await request.json();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      account: true,
      experiments: {
        where: { status: "running" },
        include: {
          snapshots: { orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const settings = product.account.settings as Record<string, unknown>;
  if (settings?.emailDigest === false) {
    return NextResponse.json({ skipped: true });
  }

  const experimentSummaries = product.experiments
    .map((exp) => {
      const latest = exp.snapshots[0];
      return `**${exp.slug}**: ${latest?.recommendation?.toUpperCase() ?? "No data"}\n${latest?.recommendationRationale ?? ""}`;
    })
    .join("\n\n");

  const htmlContent = `
    <h1>Daily Report — ${product.name}</h1>
    <p>${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    <hr />
    <h2>Running Experiments (${product.experiments.length})</h2>
    ${product.experiments
      .map((exp) => {
        const latest = exp.snapshots[0];
        const rec = latest?.recommendation?.toUpperCase() ?? "PENDING";
        return `
          <div style="margin: 16px 0; padding: 12px; border: 1px solid #e5e5e5; border-radius: 8px;">
            <strong>${exp.slug}</strong> — <span style="color: ${rec === "CONTINUE" ? "#22c55e" : rec === "PUSH" ? "#f59e0b" : "#ef4444"}">${rec}</span>
            <p style="color: #737373; font-size: 14px;">${latest?.recommendationRationale ?? "Waiting for data..."}</p>
          </div>
        `;
      })
      .join("")}
    <hr />
    <p style="color: #737373; font-size: 12px;">Sent by DrumR — P/M Fit Validation Platform</p>
  `;

  try {
    await getResend().emails.send({
      from: "DrumR <reports@drumr.app>",
      to: product.account.email,
      subject: `Daily Report — ${product.name} — ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
