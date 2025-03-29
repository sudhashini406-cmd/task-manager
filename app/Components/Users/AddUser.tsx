import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { UserFormInputs } from "../../lib/interface/Types";

function AddUser({
  onClose,
  onUserAdded,
}: {
  onClose: () => void;
  onUserAdded: (user: any) => void;
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const password = watch("password", "");

  const addUserMutation = useMutation({
    mutationFn: async (data: UserFormInputs) => {
      setLoading(true);
      const accessToken = Cookies.get("access_token");
      const bearerToken = `Bearer ${accessToken}`;

      const response = await fetch(
        import.meta.env.VITE_API_URL + `/users/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerToken,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        let errorMessage = "Something went wrong!";
        if (response.status === 401)
          errorMessage =
            "Unauthorized: Invalid or missing authentication token.";
        if (response.status === 404)
          errorMessage = "API endpoint not found (404). Please check the URL.";
        if (response.status === 422) {
          const errorData = await response.json();
          errorMessage =
            errorData.message ||
            "Invalid input data (422). Please check your form.";
        }
        if (response.status === 409) {
          const errorData = await response.json();
          errorMessage =
            errorData.message || "Conflict (409): The data already exists.";
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: async (data) => {
      const newUser = {
        id: data.id,
        firstName: data.fname,
        lastName: data.lname,
        email: data.email,
        designation: data.designation,
        mobile: data.phone_number,
        type: data.user_type,
      };
      onClose();
      onUserAdded(newUser);
    },

    onSettled: () => setLoading(false),
  });

  return (
    <div className="fixed inset-0 bg-orange bg-opacity-10 backdrop-blur-sm z-50 flex">
      <div className="flex-1"></div>
      <div className="bg-white w-96 h-full p-6 rounded-l-lg shadow-lg relative fixed right-0 top-0">
        <h2 className="text-lg font-bold mb-4">Add User</h2>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate({ to: "/users/user-table" })}
        >
          ✖
        </button>
        <form
          onSubmit={handleSubmit((data) => addUserMutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <label className="font-bold">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              {...register("fname", {
                required: "First Name Invalid",
                minLength: {
                  value: 3,
                  message: "At least 3 characters required",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.fname && (
              <p className="text-red-500 text-sm">{errors.fname.message}</p>
            )}
          </div>

          <div>
            <label className="font-bold">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              {...register("lname", { required: "Last Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.lname && (
              <p className="text-red-500 text-sm">{errors.lname.message}</p>
            )}
          </div>

          <div>
            <label className="font-bold">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              {...register("phone_number", {
                required: "Mobile number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              maxLength={10}
              className="w-full p-2 border rounded"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-bold">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="font-bold">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                })}
                className="w-full p-2 border rounded"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="font-bold">Designation</label>
            <input
              type="text"
              placeholder="Enter Designation"
              {...register("designation")}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="font-bold">
              User Type<span className="text-red-500">*</span>
            </label>
            <select
              {...register("user_type", { required: "User Type is required" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.user_type && (
              <p className="text-red-500 text-sm">{errors.user_type.message}</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/users/user-table" })}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
