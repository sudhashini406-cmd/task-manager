import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { authStore, updateAuthStore } from "./Store";
import { LockKeyhole, Eye, EyeOff, Mail } from "lucide-react";
import { LoginData } from "../../lib/interface/Types";

const SignIn = () => {
  console.log(import.meta.env);
  console.log(import.meta.env.VITE_API_URL);
  const LOGIN_API = import.meta.env.VITE_API_URL + "/auth/login";

  console.log(import.meta.env.VITE_API_URL);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginData>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid credentials");
      return response.json();
    },
    onSuccess: (data) => {
      if (data?.status !== 200 || !data?.data?.user_details) {
        setServerError("Invalid response from server.");
        return;
      }
      const token = data.data.access_token;
      Cookies.set("access_token", token, { expires: 7, secure: false });

      updateAuthStore({
        user: {
          email: data.data.user_details.email,
          token,
          role: data.data.user_details.user_type,
        },
      });

      navigate({ to: "/projects/project-table" });
    },
    onError: (error: any) => setServerError(error.message),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    setServerError("");
    mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 shadow-lg rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
            <a
              href="/forgot-password"
              className="block text-blue-500 text-sm mt-2"
            >
              Forgot Password?
            </a>
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
