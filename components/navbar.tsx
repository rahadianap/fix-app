import {
  Database,
  Group,
  LayoutDashboard,
  NotebookPen,
  Package,
  RefreshCcw,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "@radix-ui/react-dropdown-menu";

const NavBar: React.FC = () => {
  return (
    <nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="bg-transparent text-gray-50 hover:bg-emerald-700 hover:text-gray-50"
          >
            <Database />
            Master Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuItem asChild>
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
            </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <a href="/categories" className="flex items-center">
              <Group className="mr-2 h-4 w-4" />
              Kategori Barang
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/products" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Barang
            </a>
          </DropdownMenuItem>
          <Separator />
          {/* <DropdownMenuItem asChild className="mt-4">
            <Button onClick={logoutHandler}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <LogOut className="mr-2 h-4 w-4" />
              <p>Logout</p>
            </Button>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="bg-transparent text-gray-50 hover:bg-emerald-700 hover:text-gray-50"
          >
            <NotebookPen />
            Transaksi
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
          {/* <DropdownMenuItem asChild className="mt-4">
            <Button onClick={logoutHandler}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <LogOut className="mr-2 h-4 w-4" />
              <p>Logout</p>
            </Button>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavBar;
