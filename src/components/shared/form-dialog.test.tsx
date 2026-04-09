import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormDialog } from "./form-dialog";

function renderDialog(overrides: Partial<React.ComponentProps<typeof FormDialog>> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    title: "Test Dialog",
    isEdit: false,
    isPending: false,
    onSubmit: vi.fn((e) => e.preventDefault()),
    children: <input data-testid="field" />,
    ...overrides,
  };
  return { ...render(<FormDialog {...props} />), props };
}

describe("FormDialog", () => {
  it("renders title and children when open", () => {
    renderDialog();
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByTestId("field")).toBeInTheDocument();
  });

  it("shows 'Add' button when not editing", () => {
    renderDialog({ isEdit: false });
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("shows 'Save changes' button when editing", () => {
    renderDialog({ isEdit: true });
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("shows 'Saving…' and disables buttons when pending", () => {
    renderDialog({ isPending: true });
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("calls onOpenChange(false) when Cancel is clicked", async () => {
    const { props } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onSubmit when form is submitted", async () => {
    const { props } = renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it("does not render Active checkbox when onActiveChange is not provided", () => {
    renderDialog();
    expect(screen.queryByLabelText("Active")).not.toBeInTheDocument();
  });

  it("renders Active checkbox when onActiveChange is provided", () => {
    renderDialog({ onActiveChange: vi.fn(), isActive: true });
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("calls onActiveChange when checkbox is toggled", async () => {
    const onActiveChange = vi.fn();
    renderDialog({ onActiveChange, isActive: true });
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onActiveChange).toHaveBeenCalledWith(false);
  });

  it("does not render when closed", () => {
    renderDialog({ open: false });
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
  });
});
