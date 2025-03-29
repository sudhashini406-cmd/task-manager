import { useNavigate, useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  Network,
  CircleUser,
  KeyRound,
  CircleArrowLeft,
} from "lucide-react";

export function Layout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const router = useRouter();
  const navigate = useNavigate();
  const userName = "Sudhashini";

  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");

    if (storedAuthState) {
      try {
        const authObj = JSON.parse(storedAuthState);
        console.log("Stored authState in localStorage:", authObj);

        if (authObj && authObj.user && authObj.user.role) {
          setRole(authObj.user.role);
        } else {
          console.warn("Role not found in authState, defaulting to user");
          setRole("user");
        }
      } catch (error) {
        console.error("Error parsing authState object:", error);
        setRole("user");
      }
    } else {
      console.warn("No authState found in localStorage, defaulting to user");
      setRole("user");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
        localStorage.removeItem("loginSuccess");
      }, 3000);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-1/5 bg-white p-6 border-r-2 border-gray-300 left-0 top-0">
        <div className="flex justify-center mb-6">
          <img src="/lab.jpg" alt="Logo" className="w-500 h-40 rounded-full" />
        </div>
        <button
          className="flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500"
          onClick={() => navigate({ to: "/reset-password" })}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          className="flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500"
          onClick={() => navigate({ to: "/projects/project-table" })}
        >
          <Network size={20} />
          Projects
        </button>

        <button
          className="flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500"
          onClick={() => navigate({ to: "/tasks/get-task-stats" })}
        >
          <ListChecks size={20} />
          Tasks
        </button>
        {role === "admin" && (
          <button
            className="flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500"
            onClick={() => navigate({ to: "/users/user-table" })}
          >
            <Users size={20} />
            Users
          </button>
        )}
      </aside>

      <div className="flex flex-col flex-1">
        <nav className="bg-white p-4 border-b border-gray-300 flex justify-end items-center relative">
          <div className="relative">
            <button onClick={() => navigate({ to: "/tasks/add-tasks" })}>
              +Add Task
            </button>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
            >
              <CircleUser size={24} />
              {userName}
            </button>
            {dropdownOpen && (
              <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md w-48 z-10 border border-gray-200">
                <ul className="list-none p-0 m-0">
                  <li
                    onClick={() => {
                      navigate({ to: "/get-profile" });
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <CircleUser size={18} />
                    View Profile
                  </li>
                  <li
                    onClick={() => {
                      navigate({ to: "/update-password" });
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <KeyRound size={18} />
                    Update Password
                  </li>
                  <li
                    onClick={() => {
                      localStorage.clear();
                      navigate({ to: "/sign-in" });
                    }}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-red-500"
                  >
                    <CircleArrowLeft size={18} />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
        <main className="flex-1 p-6 border border-gray-300 m-6 rounded-md">
          <Outlet />
        </main>
      </div>
      {showLoginPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold">
          Login Successful!
        </div>
      )}
    </div>
  );
}
