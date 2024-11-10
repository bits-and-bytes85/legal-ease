
from flask import Flask, request, jsonify
import os
from flask_cors import CORS  # Import CORS
import logging

import fitz
import pdfplumber
from transformers import pipeline
from transformers import AutoModelForCausalLM, AutoTokenizer,pipeline
from langchain_huggingface import HuggingFacePipeline
logging.getLogger('flask_cors').level = logging.DEBUG


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
llm = HuggingFacePipeline(pipeline=summarizer)

app = Flask(__name__)

# Enable CORS
CORS(app)
HF_API_TOKEN = os.getenv("HF_TOKEN")
HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

def extract_text_from_pdf(pdf_bytes):
    """Extract text from PDF bytes using PyMuPDF and pdfplumber as a fallback."""
    text = ""
    try:
        # Use PyMuPDF to open the PDF from bytes
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"PyMuPDF failed: {e}. Trying pdfplumber...")
        # Reset stream and use pdfplumber as a fallback
    return text.strip()

def chunk_text(text, max_token_length=3000, min_chunk_length=50):
    """Split text into smaller chunks and handle short chunks gracefully."""
    sentences = text.split(". ")
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 <= max_token_length:
            current_chunk += sentence + ". "
        else:
            if len(current_chunk) >= min_chunk_length:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "

    if len(current_chunk) >= min_chunk_length:
        chunks.append(current_chunk.strip())
    print(len(chunks))
    print(len(chunks[0]))
    return chunks

# @app.route('/test', methods=['GET'])
# def test():
#     return jsonify({"test": True})

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    content = file.read()

    document_text = extract_text_from_pdf(content)

        # if not document_text.strip():
        #     return jsonify({"error": "The PDF is empty or no text could be extracted"}), 400
    print(document_text)

    try:
        chunks = chunk_text(document_text)
    except Exception as e:
        return jsonify({"error": f"Failed to chunk text: {str(e)}"}), 500

    summaries = []
    for chunk in chunks:
        try:
            summary = summarizer(chunk, max_length=200, min_length=30, do_sample=False)
            summaries.append(summary[0]['summary_text'])
        except Exception as inner_e:
            # summaries.append(f"Failed to summarize chunk: {inner_e}")
            summaries.append(f"")


    return jsonify({"summary": " ".join(summaries)})
 


if __name__ == '__main__':
    app.run(debug=True, port=6006)
