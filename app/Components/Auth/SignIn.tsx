import React, { useState } from "react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import Cookies from "js-cookie";
import { authStore, updateAuthStore } from "./Store";
import { LockKeyhole, Eye, EyeOff, Mail, AlignCenter } from "lucide-react";
import { LoginData } from "../../lib/interface/Types";



const SignIn = () => {


  //console.log(import.meta.env);
  //console.log(import.meta.env.VITE_API_URL);
  const LOGIN_API = import.meta.env.VITE_API_URL + "/auth/login";
  //console.log(import.meta.env.VITE_API_URL);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  //const[isPending,setIsPending]=useState("");

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
      if (!data.email.endsWith("@gmail.com")) {
        throw new Error("Email must be a valid Gmail address");
      }

      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) throw new Error("Invalid credentials");
      if (!response.ok) throw new Error("Login failed. Please try again.");

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
    onError: (error: any) => {
      setServerError(error.message);
    },
  });
  

  const onSubmit = (data: { email: string; password: string }) => {
    setServerError("");
    if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|gmial\.com)$/i.test(data.email)) {
      setServerError("Email must be a valid Gmail address");
      return;
    }

    mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img
        src="lab.jpg"
        alt="Lab"
        className="absolute top-0 left-0 w-50 h-30 m-4"
      />
      <div className="max-w-md p-6 text-left bg-white rounded-lg shadow-lg absolute right-150 ">
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            textAlign: "left",
          }}
        >
          Login
        </h1>

        <p>Your account awaits. Enter your details to get</p>
        <p>started!</p>
        <br />
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  //value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  value: /^[a-zA-Z0-9._%+-]+@(gmail\.com|gmial\.com)$/i,
                  message: "Email must be a valid Gmail address",
                },
              })}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/3 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <a
              href="/forgot-password"
              className="block text-blue-500 text-sm mt-1 absolute right-2 "
            >
              Forgot Password?
            </a>
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mt-8"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
