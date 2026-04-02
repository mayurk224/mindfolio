import { useNavigate } from "react-router";

import { googleLogin, googleSignup } from "@/services/authService";
import { toast } from "sonner";

export const useGoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      // Handle both standard button (credential) and custom button (access_token)
      const token = response.credential || response.access_token;
      
      const res = await googleLogin(token);

      if (res.status === 200) {
        toast.success("Login successful. Redirecting...");
        navigate("/");
      } else if (res.status === 404) {
        toast.error("Account does not exist. Please sign up.");
        navigate("/signup");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};

export const useGoogleSignup = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      // Handle both standard button (credential) and custom button (access_token)
      const token = response.credential || response.access_token;

      const res = await googleSignup(token);

      if (res.status === 201) {
        toast.success("Signup successful. Please login.");
        navigate("/login");
      } else if (res.status === 409) {
        toast.error("Account already exists. Please log in.");
        navigate("/login");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};
