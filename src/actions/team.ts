// "use server";
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
    return null;
  }
};

export const createTeam = async (
  values: any,
  user: any,
  hackathon_id: number,
) => {
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
  //   refetch();

  return response.data;
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
    return null;
  }
};
