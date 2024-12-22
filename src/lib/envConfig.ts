export const envConfig = {
  supabase: {
    supabasePublicKey: String(import.meta.env.VITE_SUPABASE_PUBLIC_KEY),
    supabaseServiceRole: String(import.meta.env.VITE_SUPABASE_SERVICE_ROLE),
    supabaseProjectId: String(import.meta.env.VITE_SUPABASE_PROJECT_ID),
    supabaseProjectUrl: String(import.meta.env.VITE_SUPABASE_PROJECT_URL),
    supabaseGraphqlApiUrl: String(
      import.meta.env.VITE_SUPABASE_GRAPHQL_API_URL
    ),
  },
  jwtSecret: String(import.meta.env.VITE_JWT_SECRET),
}
