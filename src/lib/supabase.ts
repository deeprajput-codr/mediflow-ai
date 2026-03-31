import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nuguzoxcfxgcwyunlanf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z3V6b3hjZnhnY3d5dW5sYW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTEyMzcsImV4cCI6MjA4ODU2NzIzN30.XzYNiI1KJQs2pyrf7I3Rv5074qLO_nT0eKu73RPfdvc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
