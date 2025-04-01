import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router"; //to get id from url
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Cookies from "js-cookie";
import SelectMembers from "./SelectMembers";
import { ProjectMember } from "../../lib/interface/Types";

const token = Cookies.get("access_token");

const fetchProjectMembers = async (
  projectId: string
): Promise<ProjectMember[]> => {
  if (!projectId) throw new Error("Project ID is missing");
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/members`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project members");
  }

  const data = await response.json();
  return data.data.members;
};

const deleteMember = async ({
  projectId,
  memberId,
}: {
  projectId: string;
  memberId: number;
}) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/members`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_member_id: memberId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete member");
  }

  return memberId;
};
//when i click add members and add user then the user should disabled so that i cant addit again 
const addMembers = async ({
  projectId,
  members,
}: {
  projectId: string;
  members: { user_id: number; role: string }[];
}) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/${projectId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_members: members,
        group_id: [],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add members");
  }

  return response.json();
};

export const ProjectMembers = () => {
  const { projectId } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => fetchProjectMembers(projectId ?? ""), //calls data from url
    enabled: !!projectId, //runs only when we have project id
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onMutate: async ({ memberId }) => {
      if (!projectId) {
        console.error("projectId is undefined"!);
        return;
      }
      await queryClient.cancelQueries({
        queryKey: ["projectMembers", projectId],
      });
      const previousMembers = queryClient.getQueryData([
        "projectMembers",
        projectId,
      ]);

      queryClient.setQueryData(["projectMembers", projectId], (oldData: any) =>
        oldData ? oldData.filter((member: any) => member.id !== memberId) : []
      );

      return { previousMembers };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(
          ["projectMembers", projectId],
          context.previousMembers
        );
      }
    },
    onSettled: () => {
      //queryClient.invalidateQueries({})
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: addMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
  });

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

  const columns = useMemo(
    () => [
      { header: "Sl.no", accessorKey: "sno" },
      {
        header: "Members",
        accessorKey: "name",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-3">
            <span className="text-gray-700">{row.original.name}</span>
          </div>
        ),
      },
      { header: "Role", accessorKey: "role" },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() =>
              deleteMutation.mutate({
                projectId: projectId ?? "",
                memberId: row.original.id,
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

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((member: any, index: number) => ({
      id: member.id,
      sno: index + 1,
      name: `${member.fname} ${member.lname}`,
      role: member.role,
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
      <h3 className="text-xl font-semibold text-left mb-4">Project Members</h3>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        {isSelectOpen ? "AddMembers" : "AddMembers"}
      </button>
      {isSelectOpen && <SelectMembers onConfirm={handleConfirmSelection} />}

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

export default ProjectMembers;
