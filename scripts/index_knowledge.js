const SimpleVectorDB = require('./vector_search_simple.js');
const fs = require('fs');
const path = require('path');

const db = new SimpleVectorDB();
const memoryPath = '/root/.openclaw/workspace/memory';

function indexFile(filepath, collection) {
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Split into chunks (paragraphs)
  const chunks = content.split('\n\n').filter(c => c.trim().length > 50);
  
  chunks.forEach((chunk, i) => {
    const id = `${path.basename(filepath)}_${i}`;
    db.addDocument(collection, id, chunk, {
      source: filepath,
      chunk_index: i
    });
  });
  
  console.log(`📄 Indexed ${chunks.length} chunks from ${path.basename(filepath)}`);
}

// Index all knowledge files
const knowledgeFiles = fs.readdirSync(memoryPath)
  .filter(f => f.endsWith('.md') && f.includes('Knowledge'));

console.log('🔧 Indexing Knowledge Base...\n');

knowledgeFiles.forEach(file => {
  const collection = file.replace('-Knowledge.md', '').toLowerCase();
  indexFile(path.join(memoryPath, file), collection);
});

// Save index
db.save('/root/.openclaw/workspace/vector_db/knowledge_index.json');
console.log('\n✅ Knowledge indexed successfully!');
console.log(`📊 Total collections: ${db.collections.size}`);

// Test search
console.log('\n🔍 Test search for "gambling marketing":');
const results = db.search('pulse', 'gambling marketing', 3);
results.forEach((r, i) => {
  console.log(`${i+1}. [${(r.score*100).toFixed(1)}%] ${r.text.substring(0, 100)}...`);
});
