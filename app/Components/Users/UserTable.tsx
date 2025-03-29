import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { EditUserForm } from "./EditUserForm";
import { exportToCSV } from "../Projects/ExportCsv";
import { useNavigate } from "@tanstack/react-router";

import React from "react";
import { UserData } from "../../lib/interface/Types";

const fetchUsers = async ({ queryKey }: any) => {
  const [_, page, limit, statusFilter, userType, searchName, searchEmail] =
    queryKey;
  const token = Cookies.get("access_token");

  let url =
    import.meta.env.VITE_API_URL +
    `/users/status-count?page=${page}&page_size=${limit}&active=${statusFilter === "active" ? "true" : "false"}&user_type=${userType === "user" ? "user" : "admin"}`;

  if (searchName) url += `&search_string=${searchName}`;
  if (searchEmail) url += `&search_email=${searchEmail.toLowercase()}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};
const fetchUsersByName = async (searchString: string) => {
  const token = Cookies.get("access_token");
  const exportResponse = await fetch(
    import.meta.env.VITE_API_URL +
      `/users/export?active=true&search_string=${searchString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const statusResponse = await fetch(
    import.meta.env.VITE_API_URL +
      `/users/status-count?page=1&page_size=25&search_string=${searchString}&active=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!exportResponse.ok || !statusResponse) {
    throw new Error("failed to fetch users by name");
  }
  const exportData = await exportResponse.json();
  const statusData = await statusResponse.json();
  return {
    exportData: exportData,
    statusData: statusData,
  };
};
const fetchUsersByEmail = async (email: string) => {
  const token = Cookies.get("access_token");

  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL +
        `/users/status-count?page=1&page_size=25&active=true&email=${email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    console.log("Fetched Users by Email:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users by email:", error);
    return null;
  }
};
const fetchUsersByNameAndEmail = async (
  searchString: string,
  email: string
) => {
  const token = Cookies.get("access_token");

  let url =
    import.meta.env.VITE_API_URL +
    `/users/status-count?page=1&page_size=25&active=true`;

  if (searchString) {
    url += `&search_string=${searchString}`;
  }
  if (email) {
    url += `&email=${email}`;
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the data");
    }

    const data = await response.json();
    console.log("Fetched users by Name and Email:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users by name and email:", error);
    return null;
  }
};

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [statusFilter, setStatusFilter] = useState("active");
  const [userType, setUserType] = useState("user");
  const [gotoPage, settoPage] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "users",
      page,
      limit,
      statusFilter,
      userType,
      searchName,
      searchEmail,
    ],

    queryFn: async () => {
      console.log("fetching users", {
        page,
        limit,
        statusFilter,
        userType,
        searchName,
        searchEmail,
      });
      if (searchName && searchEmail) {
        return await fetchUsersByNameAndEmail(searchName, searchEmail);
      } else if (searchName) {
        return await fetchUsersByName(searchName);
      } else if (searchEmail) {
        return await fetchUsersByEmail(searchEmail);
      } else {
        return await fetchUsers({
          queryKey: [
            "users",
            page,
            limit,
            statusFilter,
            userType,
            searchName,
            searchEmail,
          ],
        });
      }
    },
    placeholderData: (prevData) => prevData,
  });

  const users =
    (data as any)?.exportData?.data?.records ||
    (data as any)?.statusData?.data?.records ||
    (data as any)?.data?.records ||
    [];
  const totalRecords = (data as any)?.pagination_info?.total_records || 230;
  const totalPages = Math.ceil(totalRecords / limit);

  const columns = [
    {
      accessorKey: "id",
      header: "S.N",
      cell: ({ row }: any) => (page - 1) * limit + row.index + 1,
    },

    { accessorKey: "fname", header: "First Name" },
    { accessorKey: "lname", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "phone_number", header: "Mobile Number" },
    { accessorKey: "user_type", header: "User Type" },
    { accessorKey: "todo_count", header: "To Do" },
    { accessorKey: "in_progress_count", header: "In Progress" },
    { accessorKey: "overdue_count", header: "Overdue" },
    { accessorKey: "completed_count", header: "Completed" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const handleStatusChange = (
          e: React.ChangeEvent<HTMLSelectElement>
        ) => {
          const newStatus = e.target.value;
        };

        return (
          <span
            style={{
              color: row.original.active ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            <select
              value={row.original.active ? "active" : "inactive"}
              onChange={handleStatusChange}
              className="border p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </span>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => setSelectedProject(row.original)}
          >
            Edit
          </button>
          <button className="bg-red-500 text-white px-2 py-1 rounded">
            Reset Password
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="border p-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Search by Name"
          className="border p-2"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by Email"
          className="border p-2"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate({ to: "/users/add-user" })}
        >
          + Add User
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => exportToCSV(users)}
        >
          Export
        </button>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-2"
        >
          {[12, 25, 50, 150, 200, 250].map((size) => (
            <option key={size} value={size}>
              {size} / Page
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col.accessorKey} className="border p-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={13} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={13} className="text-center p-4 text-red-500">
                Error fetching users
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user: UserData, index: number) => (
              <tr key={user.email} className="border">
                {columns.map((col) => (
                  <td key={col.accessorKey} className="border p-2">
                    {col.cell
                      ? col.cell({ row: { original: user, index } })
                      : user[col.accessorKey as keyof UserData] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="text-center p-4">
                No users found. Users not found pls try again later
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center space-x-2">
        <button
          className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className={`px-3 py-1 rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      {selectedProject && (
        <EditUserForm
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default UserTable;
