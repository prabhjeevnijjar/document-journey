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
import axios from "axios";
import { useContactStore } from "@/app/store/contactStore";
import { toast } from "sonner";

interface AddContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContactsModal({
  open,
  onOpenChange,
}: AddContactsModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const {
    contacts,
    totalContacts,
    isLoading,
    setContacts,
    setTotalContacts,
    setLoading,
    setError,
  } = useContactStore();
  const handleCancel = () => {
    setName("");
    setEmail("");
  };
  const handleAddContact = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }
    const data = {
      name: name,
      email: email,
    };

    return axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "success") {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.status === "success") {
                // setContacts([]);
                setContacts(response.data.data.contacts);
                setTotalContacts(response.data.data.totalContacts);
                setError(null);
              }
            })
            .catch((error) => {
              console.error("Error fetching documents:", error);
              setError(
                error.response?.data?.message || "Failed to fetch contacts"
              );
              toast.error("Failed to fetch contacts");
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to save contact");
      });
  };
  const handleDialogClose = (nextOpen: boolean) => {
    setSelectedFile(null);
    onOpenChange(false);
    handleCancel();
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contacts</DialogTitle>
          <p className="text-sm text-gray-600">Add individual contacts </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Single Contact Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter contact name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter contact email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleAddContact} disabled={false}>
            Add Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
