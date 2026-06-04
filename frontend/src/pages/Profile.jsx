import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { userAPI } from "../api/apiServices";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found");
          return;
        }

        const res = await userAPI.getProfile();
        setUser(res.data);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4 bg-white rounded shadow m-4">
        <h2 className="text-2xl font-semibold mb-4">Profile 🔐</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {user ? (
          <>
            <p className="mb-2">Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;