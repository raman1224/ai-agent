import api from "@/utils/axios";

async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}

export default logout;