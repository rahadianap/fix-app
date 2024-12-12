"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import NavBar from "@/components/navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import Swal from "sweetalert2";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Select, { components } from "react-select";

interface Category {
  id: number;
  nama_kategori: string;
}

interface Unit {
  id: number;
  nama_satuan: string;
}

interface Product {
  id: number;
  nama_barang: string;
  kodebarcode: string;
}

export default function CreateItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [formData, setFormData] = useState({
    nama_barang: "",
    kodebarcode: "",
    unit: "",
    isi: "",
    category: "",
    pajak: false,
    details: [
      {
        saldo_awal: 0,
        hargajualkarton: 0,
        hargajualeceran: 0,
        hargabelikarton: 0,
        hargabelieceran: 0,
        hppavgkarton: 0,
        hppavgeceran: 0,
        current_stock: 0,
        nilai_akhir: 0,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [namaBarang, setNamaBarang] = useState<string>("");
  const [kodeBarcode, setKodeBarcode] = useState<string>("");
  const [selectedSatuan, setSelectedSatuan] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [isi, setIsi] = useState(0);
  const [pajak, setPajak] = useState(false);
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [hargaJualKarton, setHargaJualKarton] = useState(0);
  const [hargaJualEceran, setHargaJualEceran] = useState(0);
  const [hargaBeliKarton, setHargaBeliKarton] = useState(0);
  const [hargaBeliEceran, setHargaBeliEceran] = useState(0);
  const [hppAvgKarton, setHppAvgKarton] = useState(0);
  const [hppAvgEceran, setHppAvgEceran] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [nilaiAkhir, setNilaiAkhir] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");
  const router = useRouter();
  const { id } = use(params);

  const MenuList = ({ children, ...props }) => {
    return (
      <components.MenuList {...props}>
        {
          Array.isArray(children)
            ? children.slice(0, props.selectProps?.maxOptions) // Options
            : children // NoOptionsLabel
        }
      </components.MenuList>
    );
  };

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        setIsLoading(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/${id}`)
          .then((response) => {
            setFormData(response.data.data);
          });
      } catch (err) {
        setError("Failed to fetch units");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchUnits = async () => {
      try {
        setIsLoading(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/units`)
          .then((response) => {
            setUnits(response.data.data);
          });
      } catch (err) {
        setError("Failed to fetch units");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/categories`)
          .then((response) => {
            setCategories(response.data.data);
          });
      } catch (err) {
        setError("Failed to fetch category");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(id);
    fetchCategories();
    fetchUnits();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    formData.kodebarcode = kodeBarcode;
    formData.nama_barang = namaBarang;
    console.log(formData);
    // try {
    //   await axios.put(
    //     `${process.env.NEXT_PUBLIC_API_BACKEND}/api/products/${id}`,
    //     formData
    //   );
    //   Swal.fire({
    //     title: "Yeay!",
    //     text: "Your work has been saved!",
    //     icon: "success",
    //     showCloseButton: true,
    //   });
    //   router.push("/products");
    // } catch (err: any) {
    //   Swal.fire({
    //     title: "Error!",
    //     text: "Error creating data!",
    //     icon: "error",
    //     showCloseButton: true,
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  let optSatuan = units.map(function (unit) {
    return { value: unit.nama_satuan, label: unit.nama_satuan };
  });

  let optKategori = categories.map(function (unit) {
    return { value: unit.nama_kategori, label: unit.nama_kategori };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-emerald-500 text-primary-foreground">
        <div className="flex justify-start gap-4 items-center p-4">
          <h1 className="text-2xl font-bold">Create New Product</h1>
          <NavBar />
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="w-full p-4 flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle>Master Barang</CardTitle>
              <CardDescription>
                Enter the details for the new item
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="kodebarcode">Kode Barcode</Label>
                    <Input
                      id="kodebarcode"
                      name="kodebarcode"
                      defaultValue={formData.kodebarcode}
                      onChange={(e) => setKodeBarcode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nama_barang">Nama Barang</Label>
                    <Input
                      id="nama_barang"
                      name="nama_barang"
                      defaultValue={formData.nama_barang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Satuan</Label>
                    <Select
                      options={optSatuan}
                      inputValue={formData.unit}
                      value={formData.unit}
                      onChange={setSelectedSatuan}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          minHeight: "20px",
                          fontSize: "14px",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }),
                        menuList: (base) => ({
                          ...base,
                          fontSize: "12px",
                        }),
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isi">Isi</Label>
                    <Input
                      id="isi"
                      type="number"
                      name="isi"
                      defaultValue={formData.isi}
                      onChange={(e) => setIsi(parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori Barang</Label>
                    <Select
                      options={optKategori}
                      inputValue={formData.category}
                      value={formData.unit}
                      onChange={setSelectedKategori}
                      maxMenuHeight={175}
                      components={{ MenuList }}
                      maxOptions={20}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          minHeight: "20px",
                          fontSize: "14px",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }),
                        menuList: (base) => ({
                          ...base,
                          fontSize: "12px",
                        }),
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pajak"
                      name="pajak"
                      checked={formData.pajak == true}
                    />
                    <label
                      htmlFor="pajak"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Barang Kena Pajak
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Item"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
