"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import NavBar from "@/components/navbar";
import Table from "@/components/table";
import { Modal } from "@/components/modal";

interface Category {
  id: number;
  nama_kategori: string;
  created_by: string;
  created_at: Date;
}

interface PaginatedResponse {
  data: Category[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const Categories = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [setFilteredCategory] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [search] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const token = Cookies.get("token");
  const router = useRouter();

  const columns = [
    { key: "id", header: "ID" },
    { key: "nama_kategori", header: "Nama Kategori" },
    { key: "created_by", header: "Created by" },
    { key: "created_at", header: "Created at" },
  ];

  const fetchCategories = async (page: number) => {
    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get<PaginatedResponse>(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`,
          {
            params: {
              page,
              per_page: 10,
            },
          }
        )
        .then((response) => {
          setCategory(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setTotalPages(response.data.data.last_page);
        });
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch category");
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleView = (item: Category) => {
    setSelectedItem(item);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Category) => {
    setSelectedItem(item);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Category) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${item.id}`
      );
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
      fetchCategories(currentPage);
    } catch (error) {
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Category) => {
    try {
      if (isCreating) {
        await axios.post("https://your-laravel-api.com/items", data);
        Swal.fire({
          title: "Yeay!",
          text: "Your work has been saved!",
          icon: "success",
          showCloseButton: true,
        });
      } else {
        await axios.put(
          `https://your-laravel-api.com/items/${selectedItem?.id}`,
          data
        );
        Swal.fire({
          title: "Yeay!",
          text: "Your work has been saved!",
          icon: "success",
          showCloseButton: true,
        });
      }
      setIsModalOpen(false);
      fetchCategories(currentPage);
    } catch (error) {
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
    fetchCategories(currentPage);
  }, [currentPage]);

  async function createData(
    formData: FormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const nama_kategori = formData.get("nama_kategori") as string;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`,
        {
          nama_kategori,
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
      const nama_kategori = formData.get("nama_kategori") as string;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${id}`,
        {
          nama_kategori,
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
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${id}`
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
          <Table
            data={category}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
            isLoading={isLoading}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={selectedItem}
            isCreating={isCreating}
          />
        </div>
      </main>
    </div>
  );
};

export default Categories;
