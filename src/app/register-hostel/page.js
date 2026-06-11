import { getHostels } from "@/lib/hostels";
import RegisterHostelForm from "./RegisterHostelForm";

export default async function RegisterHostelPage() {
  const hostels = await getHostels();

  return (
    <div>
      <h1>Complete Hostel Registration</h1>

      <RegisterHostelForm hostels={hostels} />
    </div>
  );
}