import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonRowProps {
  columns: number;
}

export function SkeletonRow({ columns }: SkeletonRowProps) {
  return (
    <tr>
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
      <td className="px-6 py-4">
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
}
