"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProductsList } from "@/api/generated/products/products";
import { StockTransactionsCreateBodyReason, StockTransactionsCreateBodyType } from "@/api/model";
import { FormDialog } from "@/components/shared/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type StockTransactionFormValues,
  stockTransactionSchema,
} from "@/lib/validations/stock-transaction";

const typeLabels: Record<string, string> = {
  in: "Stock In",
  out: "Stock Out",
  adjustment: "Adjustment",
};

const reasonLabels: Record<string, string> = {
  purchase: "Purchase",
  return: "Return",
  device_scanned: "Device Scanned",
  sale: "Sale",
  damage: "Damage",
  expired: "Expired",
  correction: "Correction",
  initial_stock: "Initial Stock",
};

interface StockTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StockTransactionFormValues) => void;
  isPending: boolean;
  defaultProductId?: number;
}

export function StockTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  defaultProductId,
}: StockTransactionFormProps) {
  const { data: productsData } = useProductsList({ per_page: 100 });
  const products = productsData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockTransactionFormValues>({
    resolver: zodResolver(stockTransactionSchema),
    defaultValues: {
      product_id: defaultProductId ?? 0,
      type: StockTransactionsCreateBodyType.in,
      reason: StockTransactionsCreateBodyReason.purchase,
      quantity: 1,
      notes: null,
    },
  });

  function handleOpenChange(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Record Stock Transaction"
      isEdit={false}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1.5">
        <Label>Product</Label>
        <Select
          value={String(watch("product_id") || "")}
          onValueChange={(val) => setValue("product_id", Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name} <span className="text-muted-foreground">({p.sku})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.product_id && (
          <p className="text-xs text-destructive">{errors.product_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            value={watch("type")}
            onValueChange={(val) => setValue("type", val as StockTransactionFormValues["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StockTransactionsCreateBodyType).map((t) => (
                <SelectItem key={t} value={t}>
                  {typeLabels[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Reason</Label>
          <Select
            value={watch("reason")}
            onValueChange={(val) => setValue("reason", val as StockTransactionFormValues["reason"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StockTransactionsCreateBodyReason).map((r) => (
                <SelectItem key={r} value={r}>
                  {reasonLabels[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" {...register("notes")} placeholder="Optional notes" />
      </div>
    </FormDialog>
  );
}
