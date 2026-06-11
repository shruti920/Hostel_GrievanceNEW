import { supabaseAdmin } from "./supabaseAdmin";

export async function createComplaint(complaintData) {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .insert(complaintData)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getComplaintsByStudent(studentId) {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getComplaintsByHostel(hostelId) {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .select("*")
    .eq("hostel_id", hostelId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

export async function updateComplaintStatus(
  complaintId,
  status
) {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .update({
      status,
    })
    .eq("id", complaintId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getAllComplaints() {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

export async function getComplaintById(id) {
  const { data, error } = await supabaseAdmin
    .from("complaints")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getStudentComplaints(
  studentId
) {
  const { data, error } =
    await supabaseAdmin
      .from("complaints")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data;
}