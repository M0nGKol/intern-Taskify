"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateColumn: (columnData: { title: string; color: string }) => void;
  colorOptions: string[];
}

export function CreateColumnModal({
  isOpen,
  onClose,
  onCreateColumn,
  colorOptions,
}: CreateColumnModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateColumn({
      title: title.trim(),
      color: selectedColor,
    });

    // Reset form
    setTitle("");
    setSelectedColor(colorOptions[0]);
  };

  const handleClose = () => {
    setTitle("");
    setSelectedColor(colorOptions[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Column</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Column Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${color}`}></div>
                      <span className="capitalize">
                        {color.replace("bg-", "").replace("-600", "")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
