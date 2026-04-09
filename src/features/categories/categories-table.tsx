"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCategoriesCreate,
  useCategoriesDelete,
  useCategoriesList,
  useCategoriesUpdate,
} from "@/api/generated/categories/categories";
import type { Category } from "@/api/model";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CategoryFormValues } from "@/lib/validations/category";
import { getCategoryColumns } from "./category-columns";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryForm } from "./category-form";

export function CategoriesTable() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data, refetch } = useCategoriesList();
  const categories = data?.data ?? [];

  const createMutation = useCategoriesCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Category created");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to create category"),
    },
  });

  const updateMutation = useCategoriesUpdate({
    mutation: {
      onSuccess: () => {
        toast.success("Category updated");
        setFormOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to update category"),
    },
  });

  const deleteMutation = useCategoriesDelete({
    mutation: {
      onSuccess: () => {
        toast.success("Category deleted");
        setDeleteOpen(false);
        refetch();
      },
      onError: () => toast.error("Failed to delete category"),
    },
  });

  function handleEdit(category: Category) {
    setSelectedCategory(category);
    setFormOpen(true);
  }

  function handleDelete(category: Category) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  function handleFormSubmit(values: CategoryFormValues) {
    if (selectedCategory?.id) {
      updateMutation.mutate({ id: selectedCategory.id, data: values });
    } else {
      createMutation.mutate({ data: values });
    }
  }

  function handleConfirmDelete() {
    if (selectedCategory?.id) {
      deleteMutation.mutate({ id: selectedCategory.id });
    }
  }

  const columns = getCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete });
  const isPendingForm = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Add category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        globalFilter={search}
        onGlobalFilterChange={setSearch}
      />

      <CategoryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSubmit={handleFormSubmit}
        isPending={isPendingForm}
      />

      <CategoryDeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        category={selectedCategory}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
