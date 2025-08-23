"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, CheckCircle, AlertCircle, X } from "lucide-react";

export default function UploadCVDialog({ open, onOpenChange, onContinue }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is PDF
    if (file.type !== "application/pdf") {
      setUploadStatus("error");
      return;
    }

    setFile(file);
    // Simulate upload process
    setUploadStatus("uploading");
    setTimeout(() => {
      setUploadStatus("success");
    }, 1500);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleContinue = () => {
    if (file && uploadStatus === "success") {
      onContinue(file);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white rounded-xl">
        <DialogHeader className="pt-8 px-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Upload Candidate CV
          </DialogTitle>
          <p className="text-center text-gray-500 mt-2">
            Upload a CV to create an AI-powered interview
          </p>
        </DialogHeader>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                    dragActive
                      ? "border-black bg-gray-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleChange}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileUp className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        Drag and drop your CV here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports PDF files up to 10MB
                      </p>
                      <Button
                        onClick={onButtonClick}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileUp className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[250px]">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  {uploadStatus === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="bg-black h-2.5 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                      ></motion.div>
                    </div>
                  )}

                  {uploadStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        File uploaded successfully
                      </span>
                    </div>
                  )}

                  {uploadStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Only PDF files are supported
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!file || uploadStatus !== "success"}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
