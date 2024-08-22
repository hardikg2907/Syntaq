"use client";
import { useEffect, useState } from "react";
import { Select } from "~/components/ui/select";

const RegisterPage = ({ params }: { params: { id: number } }) => {
  const [userResults, setUserResults] = useState([]);
  const [userQuery, setUserQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/users?query=${userQuery}`);
      const data = await res.json();
      // setUserResults(data);
    };
    fetchUsers();
  }, [userQuery]);

  return (
    <div>
      {/* <RegisterForm id={params.id} /> */}
      <Select></Select>
    </div>
  );
};

export default RegisterPage;
