const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzavarvyvlzxcdqfaivh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZhcnZ5dmx6eGNkcWZhaXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjkwNTksImV4cCI6MjEwMDQwNTA1OX0.dLiKImswBSvvxjcYW2gHb7Hf2RDfY5WM-jRE009aAxA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('TOTAL USERS:', data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

async function checkProgress() {
  const { data, error } = await supabase.from('progress').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('TOTAL PROGRESS:', data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkUsers().then(checkProgress);
