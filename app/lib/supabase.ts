import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bjexhhzromjwheabcyiq.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZXhoaHpyb21qd2hlYWJjeWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjI5NjUsImV4cCI6MjA5NDMzODk2NX0.keNZnpksPJr0OHcvCy9mjh84gKNRl3j-hVicWU0QYww";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);