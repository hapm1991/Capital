// ============================================================
// Rellena estos dos valores después de crear tu proyecto en supabase.com
// Los encuentras en: Supabase → Project Settings → API
// ============================================================
const SUPABASE_URL = 'https://lulgwskhaxxuvwucuasm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1bGd3c2toYXh4dXZ3dWN1YXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODgwMjcsImV4cCI6MjEwNTc2NDAyN30.hBw4RF96eQ-JeqXk504bniEU3QuhTXbw9p9mQDLZffA';

// No necesitas tocar nada más de este archivo.
const supabaseClient = (SUPABASE_URL.startsWith('http') && window.supabase)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
