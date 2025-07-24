"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { toast } from "sonner";

interface ImportDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDocumentModal({
  open,
  onOpenChange,
}: ImportDocumentModalProps) {
  const { token } = useAuthStore();
  const [title, setTitle] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<{
    name: string;
    ufsUrl: string;
    type: string;
    size: number;
    key: string;
  } | null>(null);
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(
    null
  );

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    onOpenChange(false);
  };
  console.log("selectedFile:", selectedFile);
  const handleImport = () => {
    if (!selectedFile || !title.trim()) {
      alert("Please select a file and enter a title");
      return;
    }

    handleCancel();
  };
  const handleDeleteFile = async (fileKey: string) => {
    console.log("Deleting file with key:", fileKey);
    fetch("/api/uploadthing/delete-uploadthing-file", {
      method: "POST",
      body: JSON.stringify({ key: fileKey }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        // console.log("Delete response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Delete success:", data);
      })
      .catch((err) => {
        console.error("Error deleting file:", err);
      });
  };
  const handleFileDetailsUpload = async (file: {
    name: string;
    ufsUrl: string;
    type: string;
    size: number;
    key: string;
  }) => {
    const documentData = {
      name: file.name + new Date().getTime(),
      fileUrl: file.ufsUrl,
      mimeType: file.type,
      fileSize: file.size,
      originalFilename: file.name,
    };

    return axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/documents`, documentData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.message);
          // return { success: true, document: response.data };
        }
      })
      .catch((error) => {
        // weiill delet the uploaded file if the document save fails

        handleDeleteFile(file.key);

        toast.error(error.response?.data?.message || "Failed to save document");
      });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <p className="text-sm text-gray-600">
            Import a new document to your collection.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Import Options */}
          <div className="flex gap-3">
            <UploadButton<OurFileRouter>
              endpoint="pdfUploader"
              headers={{
                Authorization: `Bearer ${token}`,
              }}
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const uploadedFile = res[0];
                  setSelectedFile(uploadedFile);
                  setTitle(uploadedFile.name.replace(/\.[^/.]+$/, ""));
                  handleFileDetailsUpload(uploadedFile);
                  toast.success(
                    `File uploaded successfully: ${uploadedFile.name}`
                  );
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                alert(`ERROR! ${error.message}`);
              }}
            ></UploadButton>
            {selectedFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Uploaded: {selectedFile.name}
                </span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (selectedFile) {
                      handleDeleteFile(selectedFile?.key);
                      setSelectedFile(null);
                      setTitle(null);
                    }
                  }}
                >
                  X
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !title?.trim()}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
