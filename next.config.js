/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://zevxyvzpkatnumcnmxzn.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpldnh5dnpwa2F0bnVtY25teHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDc4NjEsImV4cCI6MjA2MDAyMzg2MX0.G12lxYbAFejG1cRrVuaHufKa5YOs59ojvvyAr9zn8N0',
  },
};

module.exports = nextConfig; 