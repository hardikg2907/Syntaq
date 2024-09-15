"use server";
import axios from "axios";
import { BACKEND_API_URL } from "~/utils/constants";
import { Hackathon, Session } from "~/utils/types";

export const getHackathon = async (id: number) => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/hackathons/${id}/`);
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
    console.error("Error fetching user team data:", error?.response.data);
  }
};
