import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isCreating: boolean;
  isViewing?: boolean;
  isLoading: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isCreating,
  isViewing,
  isLoading,
}: ModalProps) {
  const [formData, setFormData] = useState(
    initialData || { nama_kategori: "" }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nama_kategori: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isViewing
              ? "View Item"
              : isCreating
              ? "Create New Item"
              : "Edit Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Kategori
              </Label>
              <Input
                id="nama_kategori"
                name="nama_kategori"
                value={formData.nama_kategori}
                onChange={handleChange}
                className="col-span-3"
                readOnly={isViewing}
              />
            </div>
          </div>
          <DialogFooter>
            {!isViewing && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">
                      {isCreating ? "Creating..." : "Updating..."}
                    </span>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : isCreating ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
