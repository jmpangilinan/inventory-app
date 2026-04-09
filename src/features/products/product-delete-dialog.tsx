import type { Product } from "@/api/model";
import { DeleteDialog } from "@/components/shared/delete-dialog";

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  isPending,
}: ProductDeleteDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete product"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{product?.name}</span>? This action cannot
          be undone.
        </>
      }
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
