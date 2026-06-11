import { supabaseAdmin } from "./supabaseAdmin";

export async function getUserByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createUser({ email, name, role }) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      email,
      name,
      role,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createUserIfMissing({
  email,
  name,
  role,
}) {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return existingUser;
  }

  return createUser({
    email,
    name,
    role,
  });
}

export async function getUserById(id) {
  const { data, error } =
    await supabaseAdmin
      .from("users")
      .select(`
        *,
        hostels (
          id,
          code,
          name
        )
      `)
      .eq("id", id)
      .single();

  if (error) throw error;

  return data;
}