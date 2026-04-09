export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer_type?: string;
  causer_id?: number;
  properties?: {
    old?: Record<string, unknown>;
    new?: Record<string, unknown>;
  };
  created_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
