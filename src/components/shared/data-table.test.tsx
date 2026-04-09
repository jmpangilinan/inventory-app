import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("renders pagination even when pageCount is 1", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={1}
        page={1}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("does not render pagination when page and onPageChange are not provided", () => {
    render(<DataTable columns={columns} data={data} manualPagination pageCount={3} />);
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  it("renders pagination buttons when pageCount > 1", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={2}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={1}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={3}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange with decremented page on Previous click", async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={2}
        onPageChange={onPageChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with incremented page on Next click", async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={2}
        onPageChange={onPageChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("shows 'Showing X of Y' when totalCount is provided", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={1}
        onPageChange={() => {}}
        totalCount={45}
      />,
    );
    expect(screen.getByText("Showing 2 of 45")).toBeInTheDocument();
  });

  it("shows 'Page X of Y' when totalCount is not provided", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={2}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("renders skeleton rows instead of data when isLoading is true", () => {
    render(<DataTable columns={columns} data={[]} isLoading skeletonRows={3} />);
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
    const skeletons = document.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(3 * columns.length);
  });

  it("does not render skeleton when isLoading is false", () => {
    render(<DataTable columns={columns} data={data} isLoading={false} />);
    expect(document.querySelectorAll("[data-slot='skeleton']")).toHaveLength(0);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("disables pagination buttons while loading", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={3}
        page={2}
        onPageChange={() => {}}
        isLoading
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
