import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { ResetPasswordData } from "../../lib/interface/Types";
export function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [passwordMismatch, setPasswordMismatch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractedToken = params.get("code");
    console.log(extractedToken);
    setToken(extractedToken);
  }, []);
  const validatePassword = () => {
    const newErrors: string[] = [];

    if (!password) {
      newErrors.push("Password is required.");
    } else {
      if (password.length < 8)
        newErrors.push("New password must be at least 8 characters long.");
      else if (!/[A-Z]/.test(password))
        newErrors.push("At least one uppercase letter (A-Z) required.");
      else if (!/[a-z]/.test(password))
        newErrors.push("At least one lowercase letter (a-z) required.");
      else if (!/[0-9]/.test(password))
        newErrors.push("At least one number (0-9) required.");
      else if (!/[!@#$%^&*]/.test(password))
        newErrors.push("At least one symbol (!@#$%^&*) required.");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch("Passwords do not match.");
    } else {
      setPasswordMismatch("");
    }
    setErrors(newErrors);
    return newErrors.length === 0 && password === confirmPassword;
  };
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }
      return responseData;
    },
    onError: (error: any) => {
      console.error("Reset Password Error:", error.message);
      alert(error.message);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        alert("Password Reset Successful! You can now log in.");
        window.location.href = "/sign-in-page";
      }
    },
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!token) {
      alert("Invalid or missing reset token.");
      return;
    }
    if (!validatePassword()) return;

    resetPasswordMutation.mutate({
      new_password: password,
      confirm_new_password: confirmPassword,
      reset_password_token: token,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {password.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "400px",
            background: "#f8f8f8",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "18px",
            color: "#555",
            width: "2000px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <strong>Password Requirements:</strong>{" "}
          <ul style={{ paddingLeft: "30px", listStyleType: "none" }}>
            <li>
              <span style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}>
                {/[A-Z]/.test(password) ? "✅" : "❌"}{" "}
              </span>
              At least one uppercase letter (A-Z)
            </li>
            <li>
              <span style={{ color: /[a-z]/.test(password) ? "green" : "red" }}>
                {/[a-z]/.test(password) ? "✅" : "❌"}
              </span>{" "}
              At least one lowercase letter (a-z)
            </li>
            <li>
              <span style={{ color: /[0-9]/.test(password) ? "green" : "red" }}>
                {/[0-9]/.test(password) ? "✅" : "❌"}{" "}
              </span>
              At least one number (0-9)
            </li>
            <li>
              <span
                style={{ color: /[!@#$%^&*]/.test(password) ? "green" : "red" }}
              >
                {/[!@#$%^&*]/.test(password) ? "✅" : "❌"}{" "}
              </span>
              At least one symbol (!@#$%^&*)
            </li>
            <li>
              <span style={{ color: password.length >= 8 ? "green" : "red" }}>
                {password.length >= 8 ? "✅" : "❌"}
              </span>{" "}
              At least 8 characters long
            </li>
            <li>
              <span
                style={{
                  color:
                    password && confirmPassword && password === confirmPassword
                      ? "green"
                      : "red",
                }}
              >
                {password && confirmPassword && password === confirmPassword
                  ? "✅"
                  : "❌"}{" "}
              </span>
              Passwords match
            </li>
          </ul>
        </div>
      )}
      <div
        style={{
          width: "30%",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "left", fontSize: "20px", fontWeight: "bold" }}>
          Reset Password
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LockKeyhole
              style={{ position: "absolute", left: "10px", color: "black" }}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "black",
              }}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {passwordMismatch && (
            <div style={{ color: "red", fontSize: "14px" }}>
              {passwordMismatch}
            </div>
          )}
          {errors.length > 0 &&
            errors.map((error, index) => (
              <p key={index} style={{ color: "red", fontSize: "14px" }}>
                ❌ {error}
              </p>
            ))}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LockKeyhole
              style={{
                position: "absolute",
                left: "4px",
                color: "balck",
                pointerEvents: "none",
              }}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder=" Re-Enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                marginLeft: "-60px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "black",
              }}
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <p>1.New password must be at least 8 characters long</p>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#007bff",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            disabled={resetPasswordMutation.isPending}//replace isPending with isLoading
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Recover Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ResetPassword;
