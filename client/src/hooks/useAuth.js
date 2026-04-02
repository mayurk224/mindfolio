import { useNavigate } from "react-router";

import { googleLogin, googleSignup } from "@/services/authService";
import { toast } from "sonner";

export const useGoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);

      if (response.status === 200) {
        toast.success("Login successful. Redirecting...");
        navigate("/");
      } else if (response.status === 404) {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleSignup(credentialResponse.credential);

      if (response.status === 201) {
        toast.success("Signup successful. Please login.");
        navigate("/login");
      } else if (response.status === 409) {
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
