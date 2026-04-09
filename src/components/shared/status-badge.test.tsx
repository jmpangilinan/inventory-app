import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders Active when active is true", () => {
    render(<StatusBadge active={true} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders Inactive when active is false", () => {
    render(<StatusBadge active={false} />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders Inactive when active is undefined", () => {
    render(<StatusBadge />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});
