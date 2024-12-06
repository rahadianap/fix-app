import React, { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { SkeletonRow } from "./skeleton";

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreateNew?: () => void;
  isLoading?: boolean;
}

function Table<T extends { id: string | number }>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onCreateNew,
  isLoading = false,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((column) =>
        String(item[column.key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, columns, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search nama kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72"
          />
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="bg-sky-500 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Data
          </Button>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  scope="col"
                  className="px-6 py-3"
                >
                  {column.header}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 flex justify-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <SkeletonRow key={index} columns={columns.length} />
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column.key as string}`}
                      className="px-6 py-4"
                    >
                      {String(item[column.key])}
                    </td>
                  ))}
                  <td className="px-6 py-4 flex justify-end">
                    <div className="flex space-x-2">
                      {onView && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onView(item)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(item)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(item)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-4 text-center"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default Table;
