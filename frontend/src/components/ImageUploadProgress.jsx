import React from "react";
import { Progress } from "./ui/progress";

const ImageUploadProgress = ({ uploadProgress }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-1/2 max-w-md p-6 bg-white rounded-lg shadow-lg space-y-4">
        <p className="text-center font-medium text-gray-700">
          Uploading Image...
        </p>
        <div className="relative">
          <Progress
            value={uploadProgress}
            className="h-3 [&>div]:bg-purple-600"
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
            {uploadProgress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadProgress;
