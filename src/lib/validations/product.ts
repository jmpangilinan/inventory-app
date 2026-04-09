import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  category_id: z.number().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
