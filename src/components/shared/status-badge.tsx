import { Badge } from "@/components/ui/badge";

export function StatusBadge({ active }: { active?: boolean }) {
  return active ? (
    <Badge variant="outline" className="border-green-600 text-green-600">
      Active
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Inactive
    </Badge>
  );
}
