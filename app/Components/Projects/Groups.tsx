import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Cookies from "js-cookie";
import SelectMembers from "./SelectMembers";
import { ProjectGroup, Member } from "../../lib/interface/Types";

const token = Cookies.get("access_token");

const fetchProjectGroups = async (projectId: string) => {
  if (!projectId) throw new Error("Project ID is missing");
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/user-groups`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status == 404) {
    return [];
  }
  if (!response.ok) throw new Error("Failed to fetch project groups");

  const data = await response.json();
  return data.data;
};

const addProjectGroup = async ({ projectId, groupId }: ProjectGroup) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/user-groups`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_user_groups: [{ group_id: groupId, role: "MANAGER" }],
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to add project group");

  return response.json();
};

const deleteProjectGroup = async ({ projectId, groupId }: ProjectGroup) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/user-groups`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_user_group_id: groupId }),
    }
  );

  if (!response.ok) throw new Error("Failed to delete project group");

  return groupId;
};

export const ProjectGroups = () => {
  const { projectId } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const [groupId, setGroupId] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projectGroups", projectId],
    queryFn: () => fetchProjectGroups(projectId ?? ""),
    enabled: !!projectId,
  });

  const addMutation = useMutation({
    mutationFn: addProjectGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectGroups", projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectGroups", projectId] });
    },
  });

  const handleAddGroup = () => {
    if (!groupId) return;
    addMutation.mutate({
      projectId: projectId ?? "",
      groupId: parseInt(groupId),
    });
    setGroupId("");
  };

  const columns = useMemo(
    () => [
      { header: "Group ID", accessorKey: "group_id" },
      { header: "Group Name", accessorKey: "group_name" },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }: any) => (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() =>
              deleteMutation.mutate({
                projectId: projectId ?? "",
                groupId: row.original.group_id,
              })
            }
          >
            Remove
          </button>
        ),
      },
    ],
    [deleteMutation, projectId]
  );
  const handleConfirmSelection = (selectedUsers: number[]) => {
    setIsSelectOpen(false);
    if (selectedUsers.length > 0) {
      addMutation.mutate({
        projectId: projectId ?? "",
        members: selectedUsers.map((userId) => ({
          user_id: userId,
          role: "MEMBER",
        })),
      });
    }
  };
  //const tableData

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((group: any) => ({
      group_id: group.group_id,
      group_name: group.group_name,
    }));
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-center mb-4">
        Project User Groups
      </h3>

      <div className="mb-4">
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
        >
          {isSelectOpen ? "AddMembers" : "AddMembers"}
        </button>
        {isSelectOpen && <SelectMembers onConfirm={handleConfirmSelection} />}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-300">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left border border-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition border-b border-gray-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border border-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectGroups;
