import React from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const token = Cookies.get("access_token");

const fetchTaskStats = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/tasks/tasks-stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task stats");
  }

  return response.json();
};

const TaskStats = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["taskStats"],
    queryFn: fetchTaskStats,
    staleTime: 0, //refer data
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError)
    return (
      <div
        style={{
          padding: "10px",
          border: "1px solid red",
          background: "#ffebee",
          color: "red",
        }}
      >
       <strong>Error:</strong> {(error as Error).message}

      </div>
    );

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Total Tasks</h4>
          <p className="text-lg font-bold">{data?.data.total_tasks ?? "N/A"}</p>
        </div>
        <div className="bg-blue-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">To Do</h4>
          <p className="text-lg font-bold">{data?.data.todo_count ?? "N/A"}</p>
        </div>
        <div className="bg-yellow-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">In Progress</h4>
          <p className="text-lg font-bold">
            {data?.data.inProgress_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-red-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Overdue</h4>
          <p className="text-lg font-bold">
            {data?.data.overDue_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-green-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Completed</h4>
          <p className="text-lg font-bold">
            {data?.data.completed_count ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
