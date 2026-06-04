import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Profile fetch failed");
        }
        const data = await res.json();
        setUserName(data.name || data.email || "Farmer");
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-green-600 text-white p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-xl font-bold">Smart Farming Dashboard</div>
        {userName && (
          <p className="text-sm text-green-100 mt-1">Welcome, {userName}</p>
        )}
      </div>
      {token ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;