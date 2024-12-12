"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  RefreshCcw,
  ShoppingCart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const token = Cookies.get("token");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
        .then((response) => {
          setUser(response.data);
        });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user");
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (!token) {
      router.push("/");
    }
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex-grow flex items-center justify-center h-screen">
        <Spinner size={52}></Spinner>
      </div>
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

  const NavBar: React.FC = () => {
    return (
      <nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-transparent text-gray-50">
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href="/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/pos" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Point of Sale
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/returjual" className="flex items-center">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retur Jual
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/categories" className="flex items-center">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Kategori Barang
              </a>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem asChild className="mt-4">
              <Button onClick={logoutHandler}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogOut className="mr-2 h-4 w-4" />
                <p>Logout</p>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    );
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-emerald-500 text-primary-foreground">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <NavBar />
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="w-full p-4 flex flex-col">
          <div className="flex justify-between gap-4 mb-2">
            <h1>{user["name"]}</h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
