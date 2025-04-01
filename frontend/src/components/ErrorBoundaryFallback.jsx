import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import Dinogame from "../pages/dino";

const ErrorBoundaryFallback = () => {
  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertOctagon className="w-16 h-16 text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We've encountered an unexpected error. Don't worry, it happens to the best of us!
          </p>
          <div className="w-full mb-6 overflow-hidden rounded-lg">
            <Dinogame />
          </div>
          <p className="text-sm text-gray-500 mb-6">
            While we fix this, why not try the classic Chrome dinosaur game? Press spacebar to jump!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
