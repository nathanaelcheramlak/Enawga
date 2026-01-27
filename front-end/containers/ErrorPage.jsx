import React from "react";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@components/ui/button";

const Error = ({ message, handleError }) => {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex flex-col items-center gap-8 px-6 text-center">
        <div className="relative">
          <AlertCircle className="h-20 w-20 text-red-500 opacity-80" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              Oops! Error
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            {message}
          </p>
        </div>

        <Button
          onClick={handleError}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg gap-2 mt-4"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Error;
