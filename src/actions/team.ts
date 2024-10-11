import axios from "axios";
import { BACKEND_API_URL } from "~/utils/constants";

export const getTeam = async ({
  hackathon_id,
  user,
}: {
  hackathon_id: number;
  user: any;
}) => {
  try {
    const response = await axios.get(
      `${BACKEND_API_URL}/teams/${hackathon_id}/`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const createTeam = async (
  values: any,
  user: any,
  hackathon_id: number,
) => {
  try {
    const response = await axios.post(
      `${BACKEND_API_URL}/teams/create/`,
      {
        ...values,
        hackathon_id,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const updateTeam = async (
  values: any,
  user: any,
  hackathon_id: number,
  team_id: number,
) => {
  try {
    const response = await axios.put(
      `${BACKEND_API_URL}/teams/update/${team_id}/`,
      {
        ...values,
        hackathon_id,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getInvitationsAndMembers = async (team_id: number, user: any) => {
  try {
    const res = await axios.get(
      `${BACKEND_API_URL}/teams/members-and-invitations/${team_id}/`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      },
    );

    return res.data;
  } catch (e) {
    throw e;
  }
};
