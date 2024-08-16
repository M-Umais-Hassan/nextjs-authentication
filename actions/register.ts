"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) return { error: "Invalid fields!" };

  const { email, name, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const exitingUser = await getUserByEmail(email);

  if (exitingUser) return { error: "Email already in use!" };

  await db.user.create({
    data: { email, name, password: hashedPassword },
  });

  // TODO: Send verification token email

  return { success: "Register success!" };
};
