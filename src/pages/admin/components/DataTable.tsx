import React from "react";

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

export interface TableRow {
  id: string;
  date: string;
  user: string;
  title: string;
  status: string;
  statusColor?: string;
}

interface DataTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  loading?: boolean;
  onViewClick?: (row: TableRow) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  loading = false,
  onViewClick
}) => {
  return (
    <div className="min-w-full overflow-x-auto rounded-sm border border-neutral-200">
      <table className="min-w-full align-middle text-sm">
        <thead>
          <tr className="border-b-2 border-neutral-100 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 text-start text-sm font-semibold tracking-wider text-neutral-700 uppercase ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Loading Skeleton */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`loading-${i}`} className="animate-pulse">
                {columns.map((_, i2) => (
                  <td key={i2} className="p-3">
                    <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty State */}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-neutral-500">
                No data available.
              </td>
            </tr>
          )}

          {/* Table Rows */}
          {!loading &&
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-neutral-100 hover:bg-neutral-50"
              >
                <td className="p-3 text-neutral-600 font-semibold">{row.id}</td>
                <td className="p-3 text-neutral-600">{row.date}</td>
                <td className="p-3 text-neutral-600 font-medium">{row.user}</td>
                <td className="p-3">{row.title}</td>

                <td className="p-3">
                  <div
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      row.statusColor || "bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    {row.status}
                  </div>
                </td>

                <td className="p-3 text-end">
                  <button
                    onClick={() => onViewClick?.(row)}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:border-neutral-300 hover:text-neutral-950"
                  >
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
