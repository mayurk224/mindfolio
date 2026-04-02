import { cn } from "@/lib/utils";
import { Link, useLocation, Navigate } from "react-router";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import { useGoogleLogin, useGoogleSignup } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { GoogleIcon } from "@/components/GoogleIcon";
import ToggleTheme from "@/components/ToggleTheme";
import { toast } from "sonner";

export function AuthLayout({
  title,
  description,
  children,
  className,
  ...props
}) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const { user, loading } = useAuthContext();

  const { handleGoogleSuccess: loginSuccess, handleGoogleError: loginError } =
    useGoogleLogin();
  const { handleGoogleSuccess: signupSuccess, handleGoogleError: signupError } =
    useGoogleSignup();

  const handleSuccess = isLogin ? loginSuccess : signupSuccess;
  const handleError = isLogin ? loginError : signupError;

  const handleOAuthSuccess = (response) => {
    handleSuccess(response);
  };

  const handleOAuthError = (error) => {
    handleError(error);
  };

  const loginWithGoogle = useGoogleOAuth({
    onSuccess: handleOAuthSuccess,
    onError: handleOAuthError,
    flow: "implicit",
  });

  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <form>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                {isLogin ? (
                  <FieldDescription>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    Already have an account? <Link to="/login">Sign in</Link>
                  </FieldDescription>
                )}
              </div>
              <Field className="items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 rounded-full py-6 font-semibold"
                  onClick={() => {
                    toast.info(
                      isLogin
                        ? "Signing in with Google..."
                        : "Signing up with Google...",
                    );
                    loginWithGoogle();
                  }}
                >
                  <GoogleIcon className="size-5" />
                  {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <ToggleTheme />
      </div>
    </div>
  );
}
