import { isAxiosError } from "axios";
import api from "@/utils/axios";
import type { UserData } from "@/types/chat";

interface CurrentUserResponse {
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const { data } = await api.get<CurrentUserResponse>("/api/me");
    const id = data._id ?? data.userId;

    if (!id) {
      throw new Error("Current user response is missing an ID");
    }

    return {
      _id: id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    console.error("Get current user failed:", error);
    return null;
  }
};