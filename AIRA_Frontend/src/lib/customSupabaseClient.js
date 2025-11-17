import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxavorqrhvvblnbkecjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4YXZvcnFyaHZ2YmxuYmtlY2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTI5MDUsImV4cCI6MjA3NDU2ODkwNX0.IFeAMPbVLVyJ3eoQM7l-Q2URSsAr1TRdo3byiy7FY2I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);