import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Pencil } from "lucide-react";

const FILE_UPLOAD_API =
  import.meta.env.VITE_API_URL + "/files/upload?is_public=true";
const UPDATE_PROFILE_PIC_API =
  import.meta.env.VITE_API_URL + "/users/11/profile-pic";

const ProfilePicUploader = () => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    const token = Cookies.get("access_token");
    const bearertoken = `Bearer ${token}`;
    if (!token) throw new Error("Authentication error: Please log in again.");

    setIsUploading(true);

    try {
      const getUrlResponse = await fetch(FILE_UPLOAD_API, {
        method: "POST",
        headers: {
          Authorization: bearertoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: file.name, file_type: file.type }),
      });

      if (!getUrlResponse.ok) {
        throw new Error(
          "Error fetching upload URL: ${getUrlResponse.statusText}"
        );
      }

      const { data } = await getUrlResponse.json();
      const uploadUrl = data.target_url;
      const fileKey = data.file_key;
      console.log(uploadUrl);

      const s3UploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!s3UploadResponse.ok) {
        throw new Error(
          "Error uploading file to S3: ${s3UploadResponse.statusText}"
        );
      }

      return fileKey;
    } finally {
      setIsUploading(false);
    }
  };
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const fileKey = await uploadFile(file);
      const token = Cookies.get("access_token");
      console.log(token);
      const bearertoken = `Bearer ${token}`;

      const updateResponse = await fetch(UPDATE_PROFILE_PIC_API, {
        method: "PATCH",
        headers: {
          Authorization: bearertoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_pic: fileKey }),
      });

      if (!updateResponse.ok) {
        throw new Error(
          "Error updating profile picture: ${updateResponse.statusText}"
        );
      }

      return updateResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setErrorMessage("");
    },
    onError: (error) => {
      //setErrorMessage(error.message);
      setErrorMessage((error as Error).message);

    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    mutation.mutate(file);
  };
  return (
    <div className="relative">
      <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
        <Pencil className="w-5 h-5 text-gray-600" />
        <input
          type="file"
          className="hidden"
          accept="image/"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
export default ProfilePicUploader;
