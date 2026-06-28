import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "./use-auth";

type Tables = Database["public"]["Tables"];
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

export function useUserRows<T extends TableName>(table: T) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const query = useQuery({
    queryKey: [table, uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Tables[T]["Row"][];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [table, uid] });

  const insert = useMutation({
    mutationFn: async (values: Partial<Tables[T]["Insert"]>) => {
      if (!uid) throw new Error("Not signed in");
      const { error } = await supabase
        .from(table)
        .insert({ ...(values as object), user_id: uid } as Tables[T]["Insert"]);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Tables[T]["Update"]> }) => {
      const { error } = await supabase
        .from(table)
        .update(values as Tables[T]["Update"])
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { ...query, rows: query.data ?? [], insert, update, remove };
}
