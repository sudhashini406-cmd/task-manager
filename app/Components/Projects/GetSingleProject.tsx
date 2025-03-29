import { useQuery, useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useRef, useEffect } from "react";
import ProjectMembers from "./GetMembers";
import ProjectGroups from "./Groups";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Task,
  TaskColumnProps,
  UpdateTaskPayload,
} from "../../lib/interface/Types";

const API_URLS = {
  projectDetails: (projectId: string) =>import.meta.env.VITE_API_URL+`/projects/${projectId}`,
  taskStats: (projectId: string) =>import.meta.env.VITE_API_URL+`/projects/${projectId}/task-stats`,
  taskTodo: (projectId: string, page: number, pageSize: number) =>import.meta.env.VITE_API_URL+`/projects/${projectId}/tasks?page=${page}&page_size=${pageSize}&status=TODO&order_by=created_at:asc`,
  taskInProgress: (projectId: string, page: number, pageSize: number) =>import.meta.env.VITE_API_URL+`/projects/${projectId}/tasks?page=${page}&page_size=${pageSize}&status=IN_PROGRESS&order_by=created_at:asc`,
  taskOverdue: (projectId: string, page: number, pageSize: number) =>import.meta.env.VITE_API_URL+`/projects/${projectId}/tasks?page=${page}&page_size=${pageSize}&status=OVER_DUE&order_by=created_at:asc`,
  taskCompleted: (projectId: string, page: number, pageSize: number) =>import.meta.env.VITE_API_URL+`/projects/${projectId}/tasks?page=${page}&page_size=${pageSize}&status=COMPLETED&order_by=created_at:asc`,
  updateTaskStatus: (taskId: string) =>import.meta.env.VITE_API_URL+`/tasks/${taskId}/status`,
};

const token = Cookies.get("access_token");
const fetchData = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

const TaskCard = ({ task }: { task: Task }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.task_id, currentStatus: task.task_status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <div
      ref={ref}
      className={`p-3 border rounded-lg bg-white shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p className="font-semibold">{task.task_title}</p>
      <p className="text-sm text-gray-500">{task.task_ref_id}</p>
      <p className="text-sm text-gray-500">{task.task_priority}</p>
    </div>
  );
};

const TaskColumn = ({ title, status, tasks, moveTask }: TaskColumnProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: any) => moveTask(item.id, item.currentStatus, status),
  }));
  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);
  //add scrolling here
  return (
    <div ref={ref} className="p-3 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))}
      </div>
    </div>
  );
};

export const GetSingleProject = () => {
  const { projectId } = useParams({ strict: false });
  const [showMembers, setShowMembers] = useState(false);
  const [tasks, setTasks] = useState<any>({
    TODO: [],
    IN_PROGRESS: [],
    OVER_DUE: [],
    COMPLETED: [],
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!projectId)
    return <p className="text-red-500">Error: Project ID is missing</p>;

  const page = 1;
  const pageSize = 500;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projectData", projectId],
    queryFn: async () => {
      const [
        projectDetails,
        taskStats,
        taskTodo,
        taskInProgress,
        taskOverdue,
        taskCompleted,
      ] = await Promise.all([
        fetchData(API_URLS.projectDetails(projectId)),
        fetchData(API_URLS.taskStats(projectId)),
        fetchData(API_URLS.taskTodo(projectId, page, pageSize)),
        fetchData(API_URLS.taskInProgress(projectId, page, pageSize)),
        fetchData(API_URLS.taskOverdue(projectId, page, pageSize)),
        fetchData(API_URLS.taskCompleted(projectId, page, pageSize)),
      ]);

      setTasks({
        TODO: taskTodo.data.records ?? [],
        IN_PROGRESS: taskInProgress.data.records ?? [],
        OVER_DUE: taskOverdue.data.records ?? [],
        COMPLETED: taskCompleted.data.records ?? [],
      });

      return {
        project: projectDetails.data,
        taskStats: taskStats.data,
      };
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ taskId, newStatus }: UpdateTaskPayload) => {
      const response = await fetch(API_URLS.updateTaskStatus(taskId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update task status");
      return response.json();
    },
    onSuccess: () => {
      setSuccessMessage("Task updated successfully");
      refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
    },
  });

  const moveTask = (taskId: string, fromStatus: string, toStatus: string) => {
    setTasks((prevTasks: any) => {
      const taskToMove = prevTasks[fromStatus].find(
        (task: any) => task.task_id === taskId
      );
      if (!taskToMove || fromStatus == toStatus) {
        return prevTasks;
      }

      return {
        ...prevTasks,
        [fromStatus]: prevTasks[fromStatus].filter(
          (task: any) => task.task_id !== taskId
        ),
        [toStatus]: [
          ...prevTasks[toStatus],
          { ...taskToMove, task_status: toStatus },
        ],
      };
    });
    if (fromStatus == toStatus) {
      return;
    }

    mutation.mutate(
      { taskId, newStatus: toStatus },
      {
        onError: () => {
          setTasks((prevTasks: any) => ({
            ...prevTasks,
            [fromStatus]: [...prevTasks[fromStatus], prevTasks[toStatus].pop()],
            [toStatus]: prevTasks[toStatus].filter(
              (task: any) => task.task_id !== taskId
            ),
          }));
        },
      }
    );
  };

   if (isLoading) return <p>Loading...</p>;
 

  if (error) return <p className="text-red-500">Error loading data</p>;
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Total Tasks</h4>
          <p className="text-lg font-bold">
            {data?.taskStats?.total_tasks_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-blue-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">To Do</h4>
          <p className="text-lg font-bold">
            {data?.taskStats?.task_todo_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-yellow-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">In Progress</h4>
          <p className="text-lg font-bold">
            {data?.taskStats?.task_inprogress_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-red-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Overdue</h4>
          <p className="text-lg font-bold">
            {data?.taskStats?.task_overdue_count ?? "N/A"}
          </p>
        </div>
        <div className="bg-green-200 p-4 text-center rounded-lg">
          <h4 className="font-semibold">Completed</h4>
          <p className="text-lg font-bold">
            {data?.taskStats?.task_completed_count ?? "N/A"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">
        {data?.project?.title ?? "N/A"}
      </h2>
      <p>{data?.project?.description ?? "N/A"}</p>
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setShowMembers(!showMembers)}
        >
          {showMembers ? "Close Members" : "View Members"}
        </button>
      </div>

      {showMembers && <ProjectMembers />}
      {showMembers && <ProjectGroups />}

      <div className="grid grid-cols-4 gap-4">
        <TaskColumn
          title="TO DO"
          status="TODO"
          tasks={tasks.TODO}
          moveTask={moveTask}
        />
        <TaskColumn
          title="In Progress"
          status="IN_PROGRESS"
          tasks={tasks.IN_PROGRESS}
          moveTask={moveTask}
        />
        <TaskColumn
          title="Overdue"
          status="OVER_DUE"
          tasks={tasks.OVER_DUE}
          moveTask={moveTask}
        />
        <TaskColumn
          title="Completed"
          status="COMPLETED"
          tasks={tasks.COMPLETED}
          moveTask={moveTask}
        />
      </div>
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-10 py-6 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
    </DndProvider>
  );
};
