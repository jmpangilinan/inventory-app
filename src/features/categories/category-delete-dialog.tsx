import type { Category } from "@/api/model";
import { DeleteDialog } from "@/components/shared/delete-dialog";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isPending,
}: CategoryDeleteDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete category"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{category?.name}</span>? Products in this
          category will lose their category association.
        </>
      }
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
