import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { EditUserFormProps, ErrorState } from "../../lib/interface/Types";

const token = Cookies.get("access_token");

export const EditUserForm = ({
  project,
  onClose,
  onUpdate,
}: EditUserFormProps) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    designation: "",
    user_type: "user",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        fname: project.fname || "",
        lname: project.lname || "",
        email: project.email || "",
        phone_number: project.phone_number || "",
        designation: project.designation || "",
        user_type: project.user_type || "user",
      });
    }
  }, [project]);

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: typeof formData) => {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/users/${project.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes("email already exists")) {
          return;
        }
        throw new Error(errorData.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      console.log("User updated successfully:", data);

      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      // Fetch the latest user status count
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL +
            "/users/status-count?page=1&page_size=25&active=true",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch status count");
        }

        const statusData = await response.json();
        console.log("Updated status count:", statusData);
      } catch (err) {
        console.error("Error fetching user status count:", err);
      }

      onUpdate();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      alert(error.message || "Failed to update user. Please try again.");
    },
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-orange bg-opacity-10 backdrop-blur-sm z-50 flex">
      <div className="flex-1"></div>
      <div className="bg-white w-96 h-full p-6 rounded-l-lg shadow-lg relative fixed right-0 top-0">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
              required
            />
            {errors.fname && (
              <p className="text-red-500 text-sm">{errors.fname}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
              required
            />
            {errors.lname && (
              <p className="text-red-500 text-sm">{errors.lname}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Mobile Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
            />
          </div>{" "}
          <div>
            <label className="block font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">
              User Type <span className="text-red-500">*</span>
            </label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
