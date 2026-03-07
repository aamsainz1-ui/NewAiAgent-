const { ChromaClient } = require('chromadb');
const fs = require('fs');
const path = require('path');

const client = new ChromaClient({ path: './vector_db' });

async function setupCollections() {
  console.log('🔧 Setting up Vector DB Collections...');
  
  // Create collections for different knowledge types
  const collections = [
    'marketing_knowledge',
    'sports_analytics',
    'competitive_intel',
    'infrastructure',
    'lottery_predictions',
    'seo_greyhat',
    'gambling_strategies',
    'regional_insights'
  ];
  
  for (const name of collections) {
    try {
      await client.createCollection({ name });
      console.log(`✅ Created collection: ${name}`);
    } catch (e) {
      console.log(`ℹ️ Collection ${name} already exists`);
    }
  }
  
  console.log('✅ Vector DB setup complete!');
}

setupCollections().catch(console.error);
