import { supabaseAdmin } from "./supabaseAdmin";

export async function getHostels() {
  const { data, error } = await supabaseAdmin
    .from("hostels")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

export async function getHostelById(id) {
  const { data, error } = await supabaseAdmin
    .from("hostels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getHostelByCode(code) {
  const { data, error } = await supabaseAdmin
    .from("hostels")
    .select("*")
    .eq("code", code)
    .single();

  if (error) throw error;

  return data;
}

export async function getAllHostels() {
  const { data, error } = await supabaseAdmin
    .from("hostels")
    .select("*")
    .order("id");

  if (error) throw error;

  return data;
}