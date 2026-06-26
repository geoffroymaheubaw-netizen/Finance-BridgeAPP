import { createClient } from "@supabase/supabase-js";

/**
 * Recupere la configuration Supabase depuis les variables d'environnement
 * ou depuis le localStorage pour faciliter les tests directs dans le navigateur.
 */
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem("finance_bridge_supabase_url");
  const localKey = localStorage.getItem("finance_bridge_supabase_key");

  const metaEnv = (import.meta as any).env || {};
  const url = localUrl || metaEnv.VITE_SUPABASE_URL || "";
  const key = localKey || metaEnv.VITE_SUPABASE_ANON_KEY || "";

  return { url, key };
};

/**
 * Initialise et retourne le client Supabase.
 * Retourne null si aucune configuration valide n'est trouvee.
 */
export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return null;
  }
  try {
    return createClient(url, key);
  } catch (err) {
    console.error("Erreur d'initialisation de Supabase :", err);
    return null;
  }
};

/**
 * Verifie si Supabase est configure (soit par .env soit par localStorage)
 */
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return !!(url && key);
};

/**
 * Sauvegarde temporairement les identifiants Supabase dans le localStorage
 * pour permettre des tests rapides avant deploiement.
 */
export const saveSupabaseConfigLocally = (url: string, key: string) => {
  if (!url || !key) {
    localStorage.removeItem("finance_bridge_supabase_url");
    localStorage.removeItem("finance_bridge_supabase_key");
  } else {
    localStorage.setItem("finance_bridge_supabase_url", url.trim());
    localStorage.setItem("finance_bridge_supabase_key", key.trim());
  }
};

/**
 * Structure SQL recommandee pour Supabase pour ce projet :
 * 
 * -- Table des utilisateurs / profils
 * create table profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   username text not null,
 *   xp integer default 0,
 *   level integer default 1,
 *   streak integer default 1,
 *   cash numeric default 10000,
 *   completed_lessons text[] default '{}',
 *   portfolio jsonb default '[]'::jsonb,
 *   transactions jsonb default '[]'::jsonb,
 *   portfolio_history jsonb default '[]'::jsonb,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Activer les Row Level Security (RLS)
 * alter table profiles enable row level security;
 * 
 * -- Creer une politique de lecture/modification
 * create policy "Les utilisateurs peuvent modifier leur propre profil" 
 *   on profiles for all using (auth.uid() = id);
 * 
 * create policy "Lecture publique des profils pour le classement" 
 *   on profiles for select using (true);
 */
