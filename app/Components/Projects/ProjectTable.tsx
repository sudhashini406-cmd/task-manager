import React from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import EditProject from "./EditProject";
import { exportToCSV } from "./ExportCsv";
import { useNavigate } from "@tanstack/react-router";


import { FetchProjectParams } from "../../lib/interface/Types";

const PAGE_SIZES = [12, 25, 50, 100, 250, 500];

const fetchProjects = async ({
  page,
  pageSize,
  search = "",
  status = "",
  orderBy = "created_at:desc",
}: FetchProjectParams): Promise<any[]> => {
  const token = Cookies.get("access_token");

  if (!token) {
    console.error("No access token found!");
    return [];
  }

  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL +
        `/projects/all?page=${page}&page_size=${pageSize}&search_string=${search}&status=${status}&order_by=${orderBy}`,
        
{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    console.log("API Response:", result);//hy
    return result?.data?.records ?? [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
const ProjectTable = () => {
  const[popupMessage,setPopupMessage]=useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("true");
  const [orderBy, setOrderBy] = useState("created_at:desc");
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["projects", page, pageSize, search, status, orderBy],
    queryFn: () => fetchProjects({ page, pageSize, search, status, orderBy }),
  });

  const handleExport = () => {
    const exportUrl =
      import.meta.env.VITE_API_URL +
      `/projects/export?status=${status}&search_string=${search}&order_by=${orderBy}`;
    window.open(exportUrl, "_blank");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;
  // useEffect(()=>{
  //   const message=localStorage.getItem("ProjectSuccessMsg");
  //   if(message){
  //     setPopupMessage(message);
  //     localStorage.removeItem("ProjectSuccessMsg");
  //   }
  // },[]);

  return (
    <div>
      {popupMessage&&(
        <div className="popup-message">
          <p>{popupMessage}</p> 
          </div> 
              )}
    
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Dashboard</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="title:asc">Title Asc</option>
          <option value="title:desc">Title Desc</option>
          <option value="created_at:asc">Created On Asc</option>
          <option value="created_at:desc">Created On Desc</option>
        </select>
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => navigate({ to: "/projects/add-project" })}
          >
            + Add Project
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => exportToCSV(data)}
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-auto border p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4">
          {data.length > 0 ? (
            data.map((project: any) => (
              <div
                key={project.id}
                className="border p-4 rounded-lg shadow-lg relative"
              >
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo2.jpg"
                    alt="Logo"
                    className="absolute top-0 left-0 w-5 h-5 m-2"
                  />
                </div>
                <h6 className="text-red-500 font-bold text-xs">
                  {project.code}
                </h6>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-600">
                  {project.description || "No description"}
                </p>

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedProject(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      navigate({
                        to: `/projects/get-single-project/${project.id}`,
                      })
                    }
                  >
                    View
                  </button>
                </div>
                <span
  className={`absolute top-4 right-4 px-2 py-1 rounded text-xs ${
    project.active === true || project.active === "true" || project.active === 1
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white"
  }`}
>
  {project.active === true || project.active === "true" || project.active === 1
    ? "Active"
    : "Inactive"}
</span>
     </div>
            ))
          ) : (
            <p>No projects found</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page} </span>

          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
      {isSuccess && data.length > 0 && (
        <div className="mt-4 text-lg font-semibold">
          Total Projects: {data.length}
        </div>
      )}

      {selectedProject && (
        <EditProject
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={refetch}
        />
      )}
    </div>
    </div>
  );
};

export default ProjectTable;
