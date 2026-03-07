"""
knowledge_db — ChromaDB-based vector knowledge base for OpenClaw
Usage:
    python knowledge_db.py add "ข้อความที่ต้องการเก็บ" --topic "หัวข้อ"
    python knowledge_db.py search "คำค้นหา"
    python knowledge_db.py list
"""
import chromadb
import sys
import json
import os
import uuid
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "knowledge_db")

def get_client():
    return chromadb.PersistentClient(path=DB_PATH)

def get_collection(client):
    return client.get_or_create_collection(
        name="knowledge",
        metadata={"hnsw:space": "cosine"}
    )

def add_knowledge(text, topic="general", source="manual"):
    client = get_client()
    collection = get_collection(client)
    doc_id = str(uuid.uuid4())[:8]
    collection.add(
        documents=[text],
        metadatas=[{
            "topic": topic,
            "source": source,
            "created": datetime.now().isoformat(),
        }],
        ids=[doc_id]
    )
    print(json.dumps({"status": "ok", "id": doc_id, "topic": topic}, ensure_ascii=False))

def search_knowledge(query, n=5):
    client = get_client()
    collection = get_collection(client)
    if collection.count() == 0:
        print(json.dumps({"results": [], "message": "Knowledge base is empty"}))
        return
    results = collection.query(query_texts=[query], n_results=min(n, collection.count()))
    output = []
    for i, doc in enumerate(results["documents"][0]):
        output.append({
            "rank": i + 1,
            "text": doc,
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i] if results.get("distances") else None
        })
    print(json.dumps({"results": output}, ensure_ascii=False, indent=2))

def list_knowledge():
    client = get_client()
    collection = get_collection(client)
    count = collection.count()
    if count == 0:
        print(json.dumps({"count": 0, "message": "Knowledge base is empty"}))
        return
    all_data = collection.get()
    output = []
    for i, doc in enumerate(all_data["documents"]):
        output.append({
            "id": all_data["ids"][i],
            "text": doc[:100] + "..." if len(doc) > 100 else doc,
            "metadata": all_data["metadatas"][i]
        })
    print(json.dumps({"count": count, "items": output}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python knowledge_db.py [add|search|list] ...")
        sys.exit(1)
    
    cmd = sys.argv[1]
    if cmd == "add":
        text = sys.argv[2] if len(sys.argv) > 2 else ""
        topic = "general"
        source = "manual"
        for i, arg in enumerate(sys.argv):
            if arg == "--topic" and i + 1 < len(sys.argv):
                topic = sys.argv[i + 1]
            if arg == "--source" and i + 1 < len(sys.argv):
                source = sys.argv[i + 1]
        add_knowledge(text, topic, source)
    elif cmd == "search":
        query = sys.argv[2] if len(sys.argv) > 2 else ""
        n = 5
        for i, arg in enumerate(sys.argv):
            if arg == "-n" and i + 1 < len(sys.argv):
                n = int(sys.argv[i + 1])
        search_knowledge(query, n)
    elif cmd == "list":
        list_knowledge()
    else:
        print(f"Unknown command: {cmd}")
