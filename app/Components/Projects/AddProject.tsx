import  React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "@tanstack/react-router";
import { ErrorState } from "../../lib/interface/Types";

const createProject = async (projectData: any) => {
  const accessToken = Cookies.get("access_token");
  if (!accessToken) {
    throw new Error("Authorization Token Missing. Please log in.");
  }

  const response = await fetch(import.meta.env.VITE_API_URL + "/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create project");
  }

  return response.json();
};

const AddProjectForm = ({ onProjectAdded }: { onProjectAdded?: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    timezone: "America/Chicago",
    project_members: [],
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      console.log("Project Data:", data);

      // Reset form
      setFormData({
        title: "",
        code: "",
        description: "",
        timezone: "America/Chicago",
        project_members: [],
      });
      setErrors({});
      localStorage.setItem("ProjectSuccessMsg","project added successfully");

      // Invalidate query to refresh project list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate({to:"/projects/project-table"});
     

      if (onProjectAdded) {
        onProjectAdded();
      }
    },
    // onError: (error) => {
    //   alert("Error: " + error.message);
    // },/

    onError: (error: any) => {
      if (error.message.includes("Project title already exists")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          title: "Project title already exists",
        }));
      } 
      else if(error.message.includes("Project code already exists"))
        {
          setErrors((prevErrors)=>({
            ...prevErrors,
            code:"Project code already exists",
          }));
        }else {
        alert("Error: " + error.message);
      }
    },
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors: ErrorState = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.code.trim()) newErrors.code = "Project Code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Add Project</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-1"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <label className="block font-semibold">
          Project Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="code"
          placeholder="Enter Code"
          value={formData.code}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-1"
        />
        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}

        <label className="block font-semibold">Project Description</label>
        <textarea
          name="description"
          placeholder="Enter Project Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block font-semibold">
          Select Timezone <span className="text-red-500">*</span>
        </label>
        <select
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="America/Chicago">(GMT-5:00) Central Time</option>
          <option value="America/New_York">(GMT-4:00) Eastern Time</option>
          <option value="America/Los_Angeles">(GMT-7:00) Pacific Time</option>
        </select>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => navigate({ to: "/projects/project-table" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mutation.isLoading? "Adding..." : "Add Project"} 
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddProjectForm;

