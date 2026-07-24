const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzavarvyvlzxcdqfaivh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZhcnZ5dmx6eGNkcWZhaXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjkwNTksImV4cCI6MjEwMDQwNTA1OX0.dLiKImswBSvvxjcYW2gHb7Hf2RDfY5WM-jRE009aAxA';

const supabase = createClient(supabaseUrl, supabaseKey);

const topicsToSeed = [
  { id: 'topic-arrays', name: 'Arrays & Hashing', category: 'dsa', description: 'Fundamental array manipulation and hash maps' },
  { id: 'topic-strings', name: 'Strings', category: 'dsa', description: 'String algorithms and manipulation' },
  { id: 'topic-linkedlist', name: 'Linked Lists', category: 'dsa', description: 'Singly and doubly linked lists' },
  { id: 'topic-stacks', name: 'Stacks & Queues', category: 'dsa', description: 'LIFO and FIFO data structures' },
  { id: 'topic-trees', name: 'Trees & Graphs', category: 'dsa', description: 'Binary trees, BSTs, and graph traversals' },
  { id: 'topic-dp', name: 'Dynamic Programming', category: 'dsa', description: 'Optimization over plain recursion' },
  { id: 'topic-os', name: 'Operating Systems', category: 'cs_fundamentals', description: 'Processes, Threads, Concurrency, and Memory Management' },
  { id: 'topic-dbms', name: 'DBMS', category: 'cs_fundamentals', description: 'SQL, Normalization, Transactions, and Indexing' },
  { id: 'topic-networks', name: 'Computer Networks', category: 'cs_fundamentals', description: 'OSI Model, TCP/IP, Routing, and Protocols' },
  { id: 'topic-oop', name: 'Object-Oriented Programming', category: 'cs_fundamentals', description: 'Inheritance, Polymorphism, Encapsulation, and Abstraction' },
  { id: 'topic-systemdesign', name: 'System Design', category: 'system_design', description: 'Scalability, Load Balancing, Microservices, and Databases' }
];

async function seedTopics() {
  console.log('Seeding topics...');
  for (const t of topicsToSeed) {
    const { error } = await supabase.from('topics').upsert({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      resource_count: 0,
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.error(`Error inserting ${t.name}:`, error.message);
    } else {
      console.log(`Successfully seeded: ${t.name}`);
    }
  }
  console.log('Done!');
}

seedTopics();
