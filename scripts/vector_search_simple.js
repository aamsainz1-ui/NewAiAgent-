// Simple in-memory vector search using cosine similarity
// This is a lightweight alternative to ChromaDB for now

class SimpleVectorDB {
  constructor() {
    this.collections = new Map();
  }

  createCollection(name) {
    this.collections.set(name, []);
    console.log(`✅ Created collection: ${name}`);
    return name;
  }

  // Simple embedding function (using word frequency as proxy)
  embed(text) {
    const words = text.toLowerCase().split(/\s+/);
    const vector = {};
    words.forEach(word => {
      vector[word] = (vector[word] || 0) + 1;
    });
    return vector;
  }

  // Cosine similarity
  cosineSimilarity(vecA, vecB) {
    const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of keys) {
      const a = vecA[key] || 0;
      const b = vecB[key] || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  addDocument(collection, id, text, metadata = {}) {
    if (!this.collections.has(collection)) {
      this.createCollection(collection);
    }
    
    const embedding = this.embed(text);
    this.collections.get(collection).push({
      id,
      text,
      embedding,
      metadata,
      timestamp: Date.now()
    });
    
    return id;
  }

  search(collection, query, topK = 5) {
    if (!this.collections.has(collection)) {
      return [];
    }
    
    const queryEmbedding = this.embed(query);
    const docs = this.collections.get(collection);
    
    const scored = docs.map(doc => ({
      ...doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding)
    }));
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  save(path) {
    const fs = require('fs');
    const data = {};
    for (const [name, docs] of this.collections) {
      data[name] = docs;
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  load(path) {
    const fs = require('fs');
    if (fs.existsSync(path)) {
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      for (const [name, docs] of Object.entries(data)) {
        this.collections.set(name, docs);
      }
    }
  }
}

module.exports = SimpleVectorDB;

// Demo
if (require.main === module) {
  const db = new SimpleVectorDB();
  
  // Add some test knowledge
  db.addDocument('marketing', '1', 'TikTok ads for gambling in Thailand work best with celebrity endorsements');
  db.addDocument('marketing', '2', 'SEO for Vietnamese gambling sites requires PBN networks');
  db.addDocument('marketing', '3', 'Indonesian togel marketing uses WhatsApp groups heavily');
  
  // Search
  const results = db.search('marketing', 'Thailand gambling ads', 3);
  console.log('\n🔍 Search results for "Thailand gambling ads":');
  results.forEach((r, i) => {
    console.log(`${i+1}. [${(r.score*100).toFixed(1)}%] ${r.text}`);
  });
  
  db.save('./vector_db/simple_db.json');
}
