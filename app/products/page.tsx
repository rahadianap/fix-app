"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import NavBar from "@/components/navbar";

interface Product {
  id: number;
  nama_barang: string;
  created_by: string;
  created_at: Date;
}

const Products = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [namaBarang, setNamaBarang] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const dataPerPage = 10;
  const token = Cookies.get("token");
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/products`)
        .then((response) => {
          setProduct(response.data.data.data);
          setFilteredProduct(response.data.data.data);
          setCurrentPage(1);
        });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch product");
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (!token) {
      router.push("/");
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = product.filter((data) =>
      data.nama_barang.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProduct(results);
    setCurrentPage(1);
  }, [search, product]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredProduct.slice(indexOfFirstData, indexOfLastData);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function createData(
    formData: FormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const nama_barang = formData.get("nama_barang") as string;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products`,
        {
          nama_barang,
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to create data");
      }
      return { success: true, message: "Data created successfully" };
    } catch (error) {
      console.error("Error creating data:", error);
      return { success: false, message: "Failed to create data" };
    }
  }

  async function editData(
    id: number,
    formData: FormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const nama_barang = formData.get("nama_barang") as string;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/${id}`,
        {
          nama_barang,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to edit data");
      }
      return { success: true, message: "Data updated successfully" };
    } catch (error) {
      console.error("Error editing data:", error);
      return { success: false, message: "Failed to edit data" };
    }
  }

  async function deleteData(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/${id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete data");
      }
      return { success: true, message: "Data deleted successfully" };
    } catch (error) {
      console.error("Error deleting data:", error);
      return { success: false, message: "Failed to delete data" };
    }
  }

  const handleCreateOrEditData = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    let result;

    if (editingItem) {
      result = await editData(editingItem.id, formData);
    } else {
      result = await createData(formData);
    }

    if (result.success) {
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
      setIsDialogOpen(false);
      setEditingItem(null);
      setLoading(false);
      await fetchProducts();
    } else {
      setLoading(false);
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong!",
        icon: "error",
        showCloseButton: true,
      });
    }
  };

  const handleDeleteData = async () => {
    if (deletingItemId === null) return;
    setLoading(true);
    const result = await deleteData(deletingItemId);

    if (result.success) {
      Swal.fire({
        title: "Yeay!",
        text: "Data deleted successfully!",
        icon: "success",
        showCloseButton: true,
      });
      setIsDeleteDialogOpen(false);
      setDeletingItemId(null);
      setLoading(false);
      await fetchProducts();
    } else {
      setLoading(false);
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong!",
        icon: "error",
        showCloseButton: true,
      });
    }
  };

  if (error) return <div>{error}</div>;

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
      .then(() => {
        Cookies.remove("token");
        router.push("/");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-emerald-500 text-primary-foreground">
        <div className="flex justify-start gap-4 items-center p-4">
          <h1 className="text-2xl font-bold">Categories</h1>
          <NavBar />
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="w-full p-4 flex flex-col">
          <div className="flex justify-between gap-4 mb-2">
            <Input
              type="text"
              placeholder="Search nama kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 w-72"
            />
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setEditingItem(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create New Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Data" : "Create New Data"}
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateOrEditData} className="space-y-4">
                  <div>
                    <Label htmlFor="nama_barang">Nama Kategori</Label>
                    <Input
                      id="nama_barang"
                      name="nama_barang"
                      className="mt-2"
                      defaultValue={editingItem?.nama_barang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-row justify-end gap-4">
                    <DialogClose asChild>
                      <Button
                        className="hover:bg-gray-300"
                        type="button"
                        variant="secondary"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-700"
                      type="submit"
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  product.map(function (value, key) {
                    return (
                      <TableRow key={key}>
                        <TableCell>{value.id}</TableCell>
                        <TableCell>{value.nama_barang}</TableCell>
                        <TableCell>{value.created_by}</TableCell>
                        <TableCell>
                          {new Date(value.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingItem(value);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeletingItemId(value.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end gap-4 items-center mt-4">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || currentData.length === 0}
              className="text-sm"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of{" "}
              {Math.ceil(filteredProduct.length / dataPerPage)}
            </span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                  Math.ceil(filteredProduct.length / dataPerPage) ||
                currentData.length === 0
              }
              className="text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItemId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500  hover:bg-red-700"
              onClick={handleDeleteData}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2></Trash2>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
