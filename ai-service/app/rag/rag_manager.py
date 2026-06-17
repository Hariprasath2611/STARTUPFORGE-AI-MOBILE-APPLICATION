import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone, ServerlessSpec

class RAGManager:
  def __init__(self):
    self.api_key = os.getenv("PINECONE_API_KEY", "mock_pinecone_key")
    self.env = os.getenv("PINECONE_ENV", "us-west1-gcp")
    self.gemini_key = os.getenv("GEMINI_API_KEY")
    self.index_name = "startupforge-rag"
    self.pc = None
    self.index = None
    self.embeddings = None

    if self.gemini_key and self.gemini_key != "mock_gemini_key":
      self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=self.gemini_key)

    if self.api_key and self.api_key != "mock_pinecone_key":
      try:
        self.pc = Pinecone(api_key=self.api_key)
        # Create index if not exists
        if self.index_name not in [idx.name for idx in self.pc.list_indexes()]:
          self.pc.create_index(
            name=self.index_name,
            dimension=768, # Google embeddings dimension
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
          )
        self.index = self.pc.Index(self.index_name)
        print("✅ Pinecone Vector Database initialized.")
      except Exception as e:
        print(f"⚠️ Pinecone initialization error: {e}. Falling back to mock RAG mode.")

  def ingest_document(self, file_path: str, startup_id: str) -> bool:
    try:
      # Load document and split
      loader = PyPDFLoader(file_path)
      pages = loader.load()
      text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
      chunks = text_splitter.split_documents(pages)

      if self.index and self.embeddings:
        # Save embed vector in Pinecone
        for i, chunk in enumerate(chunks):
          vector = self.embeddings.embed_query(chunk.page_content)
          self.index.upsert(
            vectors=[(
              f"{startup_id}_{i}",
              vector,
              {"text": chunk.page_content, "startup_id": startup_id, "source": file_path}
            )]
          )
        return True
      else:
        print(f"☁️ [Mock RAG Ingestion] Document {file_path} split into {len(chunks)} fragments for startup: {startup_id}")
        return True
    except Exception as e:
      print(f"❌ Document Ingestion failed: {e}")
      return False

  def retrieve_context(self, query: str, startup_id: str, k: int = 3) -> str:
    if self.index and self.embeddings:
      try:
        query_vector = self.embeddings.embed_query(query)
        results = self.index.query(
          vector=query_vector,
          top_k=k,
          include_metadata=True,
          filter={"startup_id": {"$eq": startup_id}}
        )
        contexts = [match["metadata"]["text"] for match in results["matches"] if "metadata" in match]
        return "\n\n".join(contexts)
      except Exception as e:
        print(f"RAG search error: {e}")
        return ""
    else:
      # Mock context fallback
      print(f"🔍 [Mock RAG Retrieval] Querying vector space for startup: {startup_id} - query: '{query}'")
      return "Mock context: The target market is growing at a CAGR of 12%. Key competitors are valued at approximately $15M average."
