import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Forgot } from "../../lib/interface/Types";

const FORGOT_PASSWORD_API =
  import.meta.env.VITE_API_URL + "/auth/forgot-password";

export const ForgotPasswordPage = () => {
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendText, setResendText] = useState(
    "Didn't receive an email? Click here to resend"
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Forgot>();

  const forgotPasswordMutation = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (data: { email: string }) => {
      const response = await fetch(FORGOT_PASSWORD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send recovery email");
      return response.json();
    },
    onSuccess: () => {
      setPopupMessage("Recovery email sent successfully!");
    },
    onError: () => {
      setPopupMessage(
        "Given Email not found in the system. Please check with the admin."
      );
    },
    onSettled: () => {
      setIsLoading(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    },
  });

  const onSubmit = (data: { email: string }) => {
    setIsLoading(true);

    if (!data.email) {
      setPopupMessage("Please enter your email first.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
      setIsLoading(false);
      return;
    }

    setPopupMessage("");
    forgotPasswordMutation.mutate(data);
  };

  const handleResendClick = () => {
    setIsLoading(true);
    if (!watch("email")) {
      setPopupMessage("Please enter your email first.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setResendText("Didn't receive an email? Click here to resend");
      }, 5000);
      setIsLoading(false);
      return;
    }
    forgotPasswordMutation.mutate({ email: watch("email") });

    setTimeout(() => {
      setResendText("Didn't receive an email? Click here to resend");
    }, 5000);
  };

  return (
    //<div className="max-w-md mx-auto p-60 text-center bg-white rounded-lg shadow-md">
      <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md absolute right-150 top-1/2 transform -translate-y-1/2">

      <h2 className="text-left text-black font-bold text-xl">
        Forgot Password
      </h2>
      <p className="text-left text-gray-600">
        Enter your email address and we’ll send you a recovery link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4 relative">
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Must be a Gmail address",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Send recovery email"
          )}
        </button>
      </form>
      <button
        onClick={handleResendClick}
        disabled={isLoading}
        className="mt-3 text-blue-600 hover:underline disabled:text-gray-400"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          resendText
        )}
      </button>
      {showPopup && (
        <div className="fixed top-5 right-5 bg-orange-500 text-white p-3 rounded-md shadow-lg font-bold animate-fadeInOut">
          <p>{popupMessage}</p>
        </div>
      )}

      <a href="/" className="block mt-4 text-blue-600 hover:underline">
        Back to Login
      </a>
    </div>
  );
};

export default ForgotPasswordPage;
