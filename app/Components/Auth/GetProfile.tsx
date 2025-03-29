import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import UpdateProfilePic from "./UpdateProfilePic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiResponse, ProfileData } from "../../lib/interface/Types";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
const PROFILE_API = import.meta.env.VITE_API_URL + "/users/11";

export const fetchProfile = async (): Promise<ApiResponse> => {
  const token = Cookies.get("access_token");
  if (!token) throw new Error("No token found. Please log in again.");

  const response = await fetch(PROFILE_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok)
    throw new Error(`Error ${response.status}: ${response.statusText}`);

  return response.json();
};
const updateProfile = async (updatedData: Partial<ProfileData>) => {
  const token = Cookies.get("access_token");
  if (!token) throw new Error("No token found. Please log in again.");

  const response = await fetch(PROFILE_API, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok)
    throw new Error(`Error ${response.status}: ${response.statusText}`);

  return response.json();
};

export const GetProfile: React.FC = () => {
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<ApiResponse>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update profile!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const profile = data?.data;

  const BASE_URL = "https://labsquire-tm-assets.s3.us-east-1.amazonaws.com/";
  const profileImageUrl =
    profile && profile.profile_pic
      ? `${BASE_URL}${profile.profile_pic}`
      : "/default-avatar.png";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{(error as Error).message}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Profile Information</h2>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-green-500 text-white rounded"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
              setFormData(profile);
            }}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        )}
      </div>

      <hr className="border-t-2 border-gray-300 mb-4" />
      <div className="flex items-center gap-4 mb-6 relative">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full shadow"
        />
        <UpdateProfilePic />
        <h3 className="text-xl font-semibold">
          {profile.fname} {profile.lname}
        </h3>
      </div>

      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
      <hr className="my-4 border-t-2 border-gray-300" />

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="fname"
                value={formData.fname || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lname"
                value={formData.lname || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>First Name:</strong> {profile.fname}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.lname}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {profile.phone_number}
          </p>
        </div>
      )}
      <div>
        <strong>User Type</strong>
        <div>{profile.user_type}</div>
      </div>
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
