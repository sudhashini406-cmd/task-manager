import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const isUpperCase = /[A-Z]/.test(password);
  const isLowerCase = /[a-z]/.test(password);
  const isNumber = /[0-9]/.test(password);
  const isSymbol = /[!@#$%^&*]/.test(password);
  const isLengthValid = password.length >= 8;
  const allValid =
    isUpperCase && isLowerCase && isNumber && isSymbol && isLengthValid;

  useEffect(() => {
    if (allValid) setShowRequirements(false);
  }, [password]);

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
      // return response.json();
      const jsonResponse = await response.json();
      return jsonResponse;
    },
    onSuccess: async (data) => {
      const newUser = {
        id: data.id,
        //ig:data?.id,
        firstName: data.fname,
        lastName: data.lname,
        email: data.email,
        designation: data.designation,
        mobile: data.phone_number,
        type: data.user_type,
      };
      onUserAdded(newUser);
      setPopupMessage("User added successfully!");
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 50000);

      onClose();
      navigate({ to: "/users/user-table" });
    },
    onSettled: () => setLoading(false),
  });

  return (
    <div>
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {popupMessage}
        </div>
      )}

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
                  required: "First Name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "First name contains only letters",
                  },
                  minLength: {
                    value: 3,
                    message: "At least 3 characters required",
                  },
                })}
                className="w-full p-2 border rounded"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
                }}
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
                {...register("lname", {
                  required: "Last Name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "last name must contain only letters",
                  },
                })}
                className="w-full p-2 border rounded"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
                }}
              />

              {errors.lname && (
                <p className="text-red-500 text-sm">{errors.lname.message}</p>
              )}
            </div>

            <div>
              <label className="font-bold">Mobile Number</label>
              <div className="flex">
                <select
                  {...register("country_code", {
                    required: "Country code is required",
                  })}
                  className="p-2  border rounded-l bg-gray-200"
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (Australia)</option>
                  <option value="+81">+81 (Japan)</option>
                </select>
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
                    value: /^\S+@\S+\.\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label className="font-bold">
                Password<span className="text-red-500">*</span>
              </label>
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
                onFocus={() => setShowRequirements(true)}
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>

              {showRequirements && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    left: "0px",
                    background: "#f8f8f8",
                    padding: "10px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#555",
                    width: "300px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <strong>Password Requirements:</strong>
                  <ul className="list-none pl-4">
                    <li
                      style={{
                        color: /[A-Z]/.test(password) ? "green" : "red",
                      }}
                    >
                      {/[A-Z]/.test(password) ? "✅" : "❌"} At least one
                      uppercase letter (A-Z)
                    </li>
                    <li
                      style={{
                        color: /[a-z]/.test(password) ? "green" : "red",
                      }}
                    >
                      {/[a-z]/.test(password) ? "✅" : "❌"} At least one
                      lowercase letter (a-z)
                    </li>
                    <li
                      style={{
                        color: /[0-9]/.test(password) ? "green" : "red",
                      }}
                    >
                      {/[0-9]/.test(password) ? "✅" : "❌"} At least one number
                      (0-9)
                    </li>
                    <li
                      style={{
                        color: /[!@#$%^&*]/.test(password) ? "green" : "red",
                      }}
                    >
                      {/[!@#$%^&*]/.test(password) ? "✅" : "❌"} At least one
                      symbol (!@#$%^&*)
                    </li>
                    <li
                      style={{ color: password.length >= 8 ? "green" : "red" }}
                    >
                      {password.length >= 8 ? "✅" : "❌"} At least 8 characters
                      long
                    </li>
                  </ul>
                </div>
              )}

              <label className="font-bold">Designation</label>
              <input
                type="text"
                placeholder="Enter Designation"
                {...register("designation", {
                  // pattern: {
                  //   value: /^[a-zA-Z0-9]+$/,
                  //   message:
                  //     "Only letters and numbers are allowed, no spaces or special characters",
                  // },
                })}
                className="w-full p-2 border rounded"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
                }}
              />
            </div>

            <div>
              <label className="font-bold">
                User Type<span className="text-red-500">*</span>
              </label>
              <select
                {...register("user_type", {
                  required: "User Type is required",
                })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.user_type && (
                <p className="text-red-500 text-sm">
                  {errors.user_type.message}
                </p>
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
    </div>
  );
}

export default AddUser;
