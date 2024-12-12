"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import NavBar from "@/components/navbar";
import Table2 from "@/components/table2";
import Link from "next/link";

interface Product {
  id: number;
  nama_barang: string;
  created_by: string;
  created_at: Date;
}

interface PaginatedResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const Products = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get("token");
  const router = useRouter();

  const columns = [
    { key: "id", header: "ID" },
    { key: "nama_barang", header: "Nama Barang" },
    { key: "created_by", header: "Created by" },
    { key: "created_at", header: "Created at" },
  ];

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get<PaginatedResponse>(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products`,
          {
            params: {
              page,
              per_page: 10,
            },
          }
        )
        .then((response) => {
          setProduct(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setTotalPages(response.data.data.last_page);
        });
    } catch (err) {
      setError("Failed to fetch category");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (!token) {
      router.push("/");
    }
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (item: Product) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/${item.id}`
      );
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
      fetchProducts(currentPage);
    } catch (error) {
      Swal.fire({
        title: "Yeay!",
        text: "Your work has been saved!",
        icon: "success",
        showCloseButton: true,
      });
    }
  };

  const renderCreateButton = () => (
    <Link href="/products/create" passHref>
      <Button as="a">
        <Plus className="mr-2 h-4 w-4" /> Create New
      </Button>
    </Link>
  );

  const renderActions = (item: Product) => (
    <>
      <Link href={`/products/view/${item.id}`} passHref>
        <Button as="a" variant="outline" size="icon" title="View">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/products/edit/${item.id}`} passHref>
        <Button as="a" variant="outline" size="icon" title="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
    </>
  );

  if (error) return <div>{error}</div>;

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/logout`)
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
          <Table2
            data={product}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDelete={handleDelete}
            isLoading={isLoading}
            renderCreateButton={renderCreateButton}
            renderActions={renderActions}
          />
        </div>
      </main>
    </div>
  );
};

export default Products;
