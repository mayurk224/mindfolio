import { useNavigate } from "react-router";
import { googleLogin, googleSignup } from "@/services/authService";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    try {
      setIsLoading(true);
      // Handle both standard button (credential) and custom button (access_token)
      const token = response.credential || response.access_token;

      const res = await googleLogin(token);
      const data = await res.json();

      if (res.status === 200) {
        setUser(data.user);
        toast.success("Login successful. Redirecting...");
        navigate("/");
      } else if (res.status === 404) {
        toast.error("Account does not exist. Please sign up.");
        navigate("/signup");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
    isLoading,
  };
};

export const useGoogleSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    try {
      setIsLoading(true);
      // Handle both standard button (credential) and custom button (access_token)
      const token = response.credential || response.access_token;

      const res = await googleSignup(token);
      const data = await res.json();

      if (res.status === 201) {
        toast.success("Signup successful. Please login.");
        navigate("/login");
      } else if (res.status === 409) {
        toast.error("Account already exists. Please log in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
    isLoading,
  };
};
