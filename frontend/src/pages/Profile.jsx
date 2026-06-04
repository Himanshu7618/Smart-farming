import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

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

        const res = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Unable to fetch profile");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
        setError("Error fetching profile");
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