import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { EditProjectProps, Project } from "../../lib/interface/Types";
export const EditProject: React.FC<EditProjectProps> = ({
  project,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: "",
    code: "",
    description: "",
    timezone: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    //runs when project changes
    if (project) {
      setFormData(project);
    }
  }, [project]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //dunamically update the field
  };

  const handleUpdate = async () => {
    const token = Cookies.get("access_token");
    if (!token || !formData.id) return;

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/projects/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            code: formData.code,
            description: formData.description,
            timezone: formData.timezone,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setShowPopup(true);
        onUpdate();
        setTimeout(() => {
          setShowPopup(false);
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };
  if (!project) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>

        <label className="block font-semibold">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />

        <label className="block font-semibold mt-2">
          Project Code<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />

        <label className="block font-semibold mt-2">Project Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500">
          Project updated successfully!
        </div>
      )}
    </div>
  );
};
export default EditProject;
