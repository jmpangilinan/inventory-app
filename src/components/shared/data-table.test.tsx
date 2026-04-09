import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./data-table";

interface Row {
  id: number;
  name: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

const data: Row[] = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Beta" },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("filters rows when globalFilter is set", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        globalFilter="Alpha"
        onGlobalFilterChange={() => {}}
      />,
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });
});
