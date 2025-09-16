import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txkewyolrdkrrwwcfxwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4a2V3eW9scmRrcnJ3d2NmeHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjA0NTQsImV4cCI6MjA2NDgzNjQ1NH0.CEchHYREugy9F5Zypv2mfDu3hvU-eQc4aM-0ahFLoIQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);