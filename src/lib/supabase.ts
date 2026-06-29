import { createClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  key: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const localUrl = localStorage.getItem("finance_bridge_supabase_url");
  const localKey = localStorage.getItem("finance_bridge_supabase_key");

  return {
    url: localUrl || ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "",
    key: localKey || ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "",
  };
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  try {
    const { url, key } = getSupabaseConfig();
    if (!url || !key || url === "undefined" || key === "undefined") {
      return null;
    }
    
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }
      });
    }
    return supabaseInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

export function saveSupabaseConfig(url: string, key: string) {
  if (!url.trim() || !key.trim()) {
    localStorage.removeItem("finance_bridge_supabase_url");
    localStorage.removeItem("finance_bridge_supabase_key");
  } else {
    localStorage.setItem("finance_bridge_supabase_url", url.trim());
    localStorage.setItem("finance_bridge_supabase_key", key.trim());
  }
  // Reset the instance to force recreation with new config
  supabaseInstance = null;
}

export function clearSupabaseConfig() {
  localStorage.removeItem("finance_bridge_supabase_url");
  localStorage.removeItem("finance_bridge_supabase_key");
  supabaseInstance = null;
}
