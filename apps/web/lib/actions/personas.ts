"use server";

import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPersona(data: {
  productId: string;
  name: string;
  segmentDescription: string;
  primaryPain: string;
  currentSolution: string;
  triggerEvent: string;
  painLanguage: string[];
  channels: string[];
  demographics: Record<string, string>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id: data.productId, accountId: user.id },
  });
  if (!product) throw new Error("Product not found");

  const persona = await prisma.persona.create({
    data: {
      productId: data.productId,
      name: data.name,
      segmentDescription: data.segmentDescription,
      primaryPain: data.primaryPain,
      currentSolution: data.currentSolution,
      triggerEvent: data.triggerEvent,
      painLanguage: data.painLanguage,
      channels: data.channels,
      demographics: data.demographics,
    },
  });

  revalidatePath(`/products/${data.productId}`);
  revalidatePath(`/products/${data.productId}/persona`);

  return persona;
}

export async function updatePersona(
  personaId: string,
  data: Partial<{
    name: string;
    segmentDescription: string;
    primaryPain: string;
    currentSolution: string;
    triggerEvent: string;
    painLanguage: string[];
    channels: string[];
    demographics: Record<string, string>;
  }>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const persona = await prisma.persona.findUnique({
    where: { id: personaId },
    include: { product: true },
  });
  if (!persona || persona.product.accountId !== user.id)
    throw new Error("Not found");

  const updated = await prisma.persona.update({
    where: { id: personaId },
    data: {
      ...data,
      version: new Date(),
    },
  });

  revalidatePath(`/products/${persona.productId}`);
  revalidatePath(`/products/${persona.productId}/persona`);

  return updated;
}

export async function getPersonas(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  return prisma.persona.findMany({
    where: { product: { id: productId, accountId: user.id } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function deletePersona(personaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const persona = await prisma.persona.findUnique({
    where: { id: personaId },
    include: { product: true },
  });
  if (!persona || persona.product.accountId !== user.id)
    throw new Error("Not found");

  await prisma.persona.delete({ where: { id: personaId } });

  revalidatePath(`/products/${persona.productId}`);
  revalidatePath(`/products/${persona.productId}/persona`);
}
