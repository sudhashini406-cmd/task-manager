import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "@tanstack/react-router";

const token = Cookies.get("access_token");

const fetchProjects = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/projects/projects-all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

const fetchTags = async () => {
  const response = await fetch(
    import.meta.env.VITE_API_URL+"/tasks/tags-drop-down",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  return response.json();
};

const addTask = async (taskData: any) => {
  const response = await fetch(import.meta.env.VITE_API_URL + `/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to submit the task");
  }

  return response.json();
};

const AddTask = () => {
  const queryClient = useQueryClient();

  const {
    data: projectsData,
    error: projectsError,
    isLoading: loadingProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const {
    data: tagsData,
    error: tagsError,
    isLoading: loadingTags,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      alert("Task added successfully! ");
      console.log("Task Added:", data);

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      //alert("Error submitting task: " + error.message);
      alert("Error submitting task: " + (error as Error).message);

    },
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!taskTitle.trim()) {
      newErrors.taskTitle = "Task Title is required.";
    } else if (taskTitle.trim().length < 3) {
      newErrors.taskTitle = "Minimum 3 letters are required.";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due Date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTask = {
      title: taskTitle,
      ref_id: "",
      description,
      priority: priority || "LOW",
      status: "TODO",
      due_date: `${dueDate} 12:00 AM`,
      project_id: selectedProject ? parseInt(selectedProject) : null,
      users: [],
      groups: [],
    };
    mutation.mutate(newTask);
  };

  return (
    <div className="p-6 bg-gray-100 max-w-3xl mx-auto rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Task</h2>

      {(loadingProjects || loadingTags) && <p>Loading...</p>}

      {/* {projectsError && (
        <div className="p-4 border border-red-500 bg-red-100 text-red-700 mb-3">
          <strong>Error:</strong> {projectsError.message}
        </div>
      )}
      {tagsError && (
        <div className="p-4 border border-red-500 bg-red-100 text-red-700 mb-3">
          <strong>Error:</strong> {tagsError.message}
        </div>
      )} */}
      {projectsError instanceof Error && (
  <div className="p-4 border border-red-500 bg-red-100 text-red-700 mb-3">
    <strong>Error:</strong> {projectsError.message}
  </div>
)}
{tagsError instanceof Error && (
  <div className="p-4 border border-red-500 bg-red-100 text-red-700 mb-3">
    <strong>Error:</strong> {tagsError.message}
  </div>
)}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">--Select Project--</option>
            {projectsData?.data.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.dueDate && <p className="text-red-500">{errors.dueDate}</p>}
        </div>

        <div>
          <label className="block font-semibold">
            Priority Level<span className="text-red-500">*</span>{" "}
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => {
              const value = e.target.value;
              setTaskTitle(value);

              if (value.trim().length < 3) {
                setErrors((prev) => ({
                  ...prev,
                  taskTitle: "Minimum 3 letters are required.",
                }));
              } else {
                setErrors((prev) => ({ ...prev, taskTitle: "" }));
              }
            }}
            className="w-full p-2 border rounded"
          />
          {errors.taskTitle && (
            <p className="text-red-500">{errors.taskTitle}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-semibold">Tags</label>
          <select
            multiple
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(
                Array.from(
                  e.target.selectedOptions,
                  (option: any) => option.value
                )
              )
            }
            className="w-full p-2 border rounded"
          >
            {tagsData?.data.map((tag: any) => (
              <option key={tag.id} value={tag.id}>
                {tag.title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() =>
              //navigate({ to: `/projects/get-single-project/${projectId}` })
              navigate({ to: "/tasks/get-task-stats" })
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
