import React from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./app.routes";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </>
  );
};

export default App;
