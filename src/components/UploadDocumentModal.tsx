"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { toast } from "sonner";
import { useDocumentStore } from "@/app/store/documentStore";

interface ImportDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchDocuments: () => void;
}

export function ImportDocumentModal({
  open,
  onOpenChange,
}: ImportDocumentModalProps) {
  const { setDocuments, setTotalDocuments, setError } = useDocumentStore();
  const { token } = useAuthStore();
  const [selectedFile, setSelectedFile] = React.useState<{
    name: string;
    ufsUrl: string;
    type: string;
    size: number;
    key: string;
  } | null>(null);

  const handleDialogClose = (nextOpen: boolean) => {
    setSelectedFile(null);
    onOpenChange(nextOpen);
  };

  const handleDeleteFile = async (fileKey: string) => {
    fetch("/api/uploadthing/delete-uploadthing-file", {
      method: "POST",
      body: JSON.stringify({ key: fileKey }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {})
      .catch(() => {});
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
        console.log("Document saved successfully:", response);
        if (response.data.status === "success") {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            })
            .then((response) => {
              console.log("Documents fetched successfully:", response);
              if (response.data.status === "success") {
                console.log("Document saved successfully:", response);
                setDocuments(response.data.data.documents);
                setTotalDocuments(response.data.data.total);
                setError(null);
                toast.success("Document uploaded successfully");
                onOpenChange(false);
              }
            })
            .catch((error) => {
              console.error("Error saving document:", error);
              toast.error(
                error.response?.data?.message || "Failed to save document"
              );
            });
        }
      })
      .catch((error) => {
        // weiill delet the uploaded file if the document save fails

        handleDeleteFile(file.key);

        toast.error(error.response?.data?.message || "Failed to save document");
      });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleDialogClose(nextOpen);
        } else {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <p className="text-sm text-gray-600">
            Upload a new document to your collection.
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
                    }
                  }}
                >
                  X
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
