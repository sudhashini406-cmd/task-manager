import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { UpdatePasswordData } from "../../lib/interface/Types";
import { ArrowLeft } from "lucide-react";
const UPDATE_PASSWORD_API = import.meta.env + "/users/update-password";
const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  };
};

const updatePassword = async (passwords: UpdatePasswordData) => {
  const token = Cookies.get("access_token");
  if (!token) throw new Error("401: No token found. Please log in again.");

  const response = await fetch(UPDATE_PASSWORD_API, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwords),
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error("401: Provided current password is wrong.");
  } else if (response.status === 422) {
    throw new Error(
      data.message || "422: Invalid input. Please check your details."
    );
  } else if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
};
export const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordReqs, setPasswordReqs] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showPasswordReqs, setShowPasswordReqs] = useState(false); // Show password requirements only after typing
  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      alert(" Password Changed Successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({ current: "", newPass: "", confirm: "" });
      setShowPasswordReqs(false);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let tempErrors = { current: "", newPass: "", confirm: "" };

    if (!current_password) tempErrors.current = "Current password is required.";
    if (!new_password) tempErrors.newPass = "New password is required.";
    if (current_password && new_password && !confirm_new_password)
      tempErrors.confirm = "Confirm password is required.";
    else if (new_password !== confirm_new_password)
      tempErrors.confirm = "❌ Passwords do not match.";
    setErrors(tempErrors);
    if (!tempErrors.current && !tempErrors.newPass && !tempErrors.confirm) {
      mutation.mutate({ current_password, new_password, confirm_new_password });
    }
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setErrors((prev) => ({ ...prev, newPass: "" }));

    const validation = validatePassword(e.target.value);
    setPasswordReqs(validation);
    setShowPasswordReqs(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block font-medium">
            Current Password <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type={showPassword.current ? "text" : "password"}
            value={current_password}
            placeholder="Current Password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, current: !prev.current }))
            }
            className="absolute right-3 top-10"
          >
            {showPassword.current ? <Eye /> : <EyeOff />}
          </button>
          {errors.current && (
            <p className="text-red-500 text-sm">{errors.current}</p>
          )}
        </div>
        <div className="relative">
          <label className="block font-medium">
            New Password <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type={showPassword.new ? "text" : "password"}
            value={new_password}
            placeholder="New Password"
            onChange={handleNewPasswordChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, new: !prev.new }))
            }
            className="absolute right-3 top-10"
          >
            {showPassword.new ? <Eye /> : <EyeOff />}
          </button>
          {errors.newPass && (
            <p className="text-red-500 text-sm">{errors.newPass}</p>
          )}
          {showPasswordReqs && (
            <div className="border p-3 mt-2 rounded bg-gray-100">
              <p
                className={
                  passwordReqs.uppercase ? "text-green-500" : "text-gray-500"
                }
              >
                {passwordReqs.uppercase ? "✅" : "❌"} At least one uppercase
                letter (A-Z)
              </p>
              
              <p
                className={
                  passwordReqs.lowercase ? "text-green-500" : "text-gray-500"
                }
              >
                {passwordReqs.lowercase ? "✅" : "❌"} At least one lowercase
                letter (a-z)
              </p>
              <p
                className={
                  passwordReqs.number ? "text-green-500" : "text-gray-500"
                }
              >
                {passwordReqs.number ? "✅" : "❌"} At least one number (0-9)
              </p>
              <p
                className={
                  passwordReqs.specialChar ? "text-green-500" : "text-gray-500"
                }
              >
                {passwordReqs.specialChar ? "✅" : "❌"} At least one symbol
                (!@#$%^&*)
              </p>
              <p
                className={
                  passwordReqs.length ? "text-green-500" : "text-gray-500"
                }
              >
                {passwordReqs.length ? "✅" : "❌"} At least 8 characters long
              </p>
              <li>
                <span
                  style={{
                    color:
                      new_password &&
                      confirm_new_password &&
                      new_password === confirm_new_password
                        ? "green"
                        : "red",
                  }}
                >
                  {new_password &&
                  confirm_new_password &&
                  new_password === confirm_new_password
                    ? "✅"
                    : "❌"}{" "}
                </span>
                Passwords match
              </li>
            </div>
          )}
        </div>
        {/* Confirm Password */}
        <div className="relative">
          <label className="block font-medium">
            Confirm New Password <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type={showPassword.confirm ? "text" : "password"}
            value={confirm_new_password}
            placeholder="Confrim Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
            className="absolute right-3 top-10"
          >
            {showPassword.confirm ? <Eye /> : <EyeOff />}
          </button>
          {errors.confirm && (
            <p className="text-red-500 text-sm">{errors.confirm}</p>
          )}
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
          onClick={() => navigate({ to: "/users/user-table" })}
        >
          Cancel
        </button>{" "}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Updating..." : "Update"}
        </button>
      </form>
      <div>
        <button
          onClick={() => navigate({ to: "/projects/project-table" })}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 
             text-black font-semibold rounded-md shadow-md transition duration-200"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    </div>
  );
};
