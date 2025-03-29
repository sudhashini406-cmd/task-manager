import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import Cookies from "js-cookie";

const fetchUsers = async () => {
  const token = Cookies.get("access_token");
  if (!token) throw new Error("Authentication token not found");

  const response = await fetch(
    import.meta.env.VITE_API_URL + `/users/all?include_admins=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch users");

  const data = await response.json();
  return data.data;
};

export const SelectMembers = ({
  onConfirm,
}: {
  onConfirm: (selected: number[]) => void;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchUsers,
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleUserSelection = useCallback((userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    return data
      .map((user: any) => ({
        id: user.id,
        name: `${user.fname} ${user.lname}`,
      }))
      .filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, searchTerm]);

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-96">
      <h3 className="text-xl font-semibold text-center mb-4">Select Members</h3>
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user: any) => (
            <label
              key={user.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedUsers.includes(user.id)}
                onChange={() => toggleUserSelection(user.id)}
              />
              <span className="text-gray-700">{user.name}</span>
            </label>
          ))
        ) : (
          <p className="text-gray-500 text-center">No users found</p>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setSelectedUsers([])}
          className="px-4 py-2 bg-gray-400 text-white rounded-md"
        >
          Clear
        </button>
        <button
          onClick={() => onConfirm(selectedUsers)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SelectMembers;
