// "use server";
import axios from "axios";
import { BACKEND_API_URL } from "~/utils/constants";
import type { Hackathon, Session } from "~/utils/types";

export const getHackathon = async (id: number, expand: boolean) => {
  try {
    const response = await axios.get(
      `${BACKEND_API_URL}/hackathons/${id}/${expand ? "?expand=organizer" : ""}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching hackathon data:", error?.response.data);
  }
};

export const createHackathon = async (values: Hackathon, user: Session) => {
  try {
    const response = await axios.post(
      `${BACKEND_API_URL}/hackathons/`,
      {
        ...values,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating hackathon:", error?.response.data);
    throw new Error(error?.response.data);
  }
};

export const updateHackathon = async (
  id: number,
  values: Hackathon,
  user: Session,
) => {
  try {
    const response = await axios.patch(
      `${BACKEND_API_URL}/hackathons/${id}/`,
      {
        ...values,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating hackathon:", error?.response.data);
    throw new Error(error?.response.data);
  }
};

export const getUserTeam = async (id: number, user: any) => {
  try {
    const response = await axios.get(
      `${BACKEND_API_URL}/hackathons/${id}/user-team/`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user team data:", error?.response?.data);
    throw new Error(error?.response?.data);
  }
};

export const getOrganizedHackathons = async (user: any) => {
  try {
    const response = await axios.get(
      `${BACKEND_API_URL}/hackathons/organized-hackathons/`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching organized hackathons:", error?.response.data);
    throw new Error(error?.response.data);
  }
};

export const getParticipatedHackathons = async (user: any) => {
  try {
    const response = await axios.get(
      `${BACKEND_API_URL}/hackathons/participated-hackathons/`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching participated hackathons:",
      error?.response?.data,
    );
    throw new Error(error?.response?.data);
  }
};
