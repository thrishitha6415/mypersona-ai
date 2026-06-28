import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type TableName =
  | "skills"
  | "achievements"
  | "certificates"
  | "projects"
  | "internships"
  | "career_goals"
  | "documents"
  | "journey_events"
  | "recommendations";

export function useUserRows<Row extends { id: string }>(table: TableName) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const query = useQuery({
    queryKey: [table, uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [table, uid] });

  const insert = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (!uid) throw new Error("Not signed in");
      const { error } = await (supabase as any)
        .from(table)
        .insert({ ...values, user_id: uid });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await (supabase as any).from(table).update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { ...query, rows: (query.data ?? []) as Row[], insert, update, remove };
}
