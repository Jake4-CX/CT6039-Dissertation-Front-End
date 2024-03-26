import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import ViewReportModal from "../modals/viewReport";

interface TestsTableComponentProps {
  loadTests: ViewLoadTestModal | undefined
}

export const columns: ColumnDef<LoadTestTestsModel>[] = [
  {
    accessorKey: 'id',
    header: 'Run ID'
  },
  {
    accessorKey: 'loadTestType',
    header: 'Test Type',
    cell: ({ row }) => <Badge className="capitalize">{row.original.loadTestType.toLowerCase()}</Badge>
  },
  {
    accessorKey: 'createdAt',
    header: 'Start Time',
    cell: ({ row }) => moment(row.original.createdAt).fromNow()
  },
  {
    header: 'End Time',
    cell: ({ row }) => moment(row.original.createdAt).add(row.original.duration, 'milliseconds').fromNow()
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => <Badge className="capitalize">{row.original.state.toLowerCase()}</Badge>
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => `${row.original.duration / 1000}s`
  },
  {
    header: 'Actions',
    cell: ({ row }) => <ViewReportModal loadTestsTest={row.original}  />
  }
]


const TestsTableComponent: React.FC<TestsTableComponentProps> = ({ loadTests }) => {

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'id',
      desc: true
    }
  ])


  const table = useReactTable({
    data: loadTests?.test.loadTests || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    }
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="flex items-center justify-center">
                <RefreshCw className="animate-spin w-6 h-6" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default TestsTableComponent;