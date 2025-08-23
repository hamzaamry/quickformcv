"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddSocial({
  open,
  onOpenChange,
  onSave,
  initialData = null,
  isEditing = false,
}) {
  const [socialNetwork, setSocialNetwork] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (initialData && open) {
      setSocialNetwork(initialData.network || "");
      setLink(initialData.url || "");
    } else if (!open) {
      setSocialNetwork("");
      setLink("");
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!socialNetwork || !link) return;

    const socialData = {
      network: socialNetwork,
      url: link,
    };

    // If editing, preserve the ID
    if (isEditing && initialData?.id) {
      socialData.id = initialData.id;
    }
    onSave(socialData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit social network" : "Add a social network"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="social" className="text-sm font-medium">
              Social network
            </label>
            <Input
              id="social"
              placeholder="ex: LinkedIn"
              value={socialNetwork}
              onChange={(e) => setSocialNetwork(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="link" className="text-sm font-medium">
              Link
            </label>
            <Input
              id="link"
              placeholder="https://linkedin.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Discard
          </Button>
          <Button onClick={handleSave}>{isEditing ? "Update" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
