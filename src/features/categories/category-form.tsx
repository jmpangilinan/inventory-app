"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Category } from "@/api/model";
import { FormDialog } from "@/components/shared/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type CategoryFormValues, categorySchema } from "@/lib/validations/category";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (values: CategoryFormValues) => void;
  isPending: boolean;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSubmit,
  isPending,
}: CategoryFormProps) {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: null, is_active: true },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name ?? "",
        description: category.description ?? null,
        is_active: category.is_active ?? true,
      });
    } else {
      reset({ name: "", description: null, is_active: true });
    }
  }, [category, reset]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Category" : "Add Category"}
      isEdit={isEdit}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
      isActive={watch("is_active")}
      onActiveChange={(checked) => setValue("is_active", checked)}
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="Category name" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} placeholder="Optional description" />
      </div>
    </FormDialog>
  );
}
