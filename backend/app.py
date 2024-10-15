from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def highlight_keywords(text, keywords):
    highlighted_text = text
    for keyword in keywords:
        highlighted_text = highlighted_text.replace(keyword, f"<mark>{keyword}</mark>")
    return highlighted_text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'keywords' not in request.form:
        return jsonify({'error': 'No file or keywords provided'}), 400

    file = request.files['file']
    keywords = request.form['keywords'].split(',')

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    if file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith('.docx'):
        text = extract_text_from_docx(file_path)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    counts = {keyword.strip(): text.lower().count(keyword.strip().lower()) for keyword in keywords}
    highlighted_text = highlight_keywords(text, keywords)

    return jsonify({'counts': counts, 'highlightedText': highlighted_text.splitlines()})

if __name__ == '__main__':
    app.run(debug=True)
