import os
import sys
import zipfile
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from read_docx import read_docx


def create_test_docx(text_paragraphs, path):
    """Helper to create a minimal .docx file with given paragraphs."""
    document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    document_xml += '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
    for para in text_paragraphs:
        document_xml += f'<w:p><w:r><w:t>{para}</w:t></w:r></w:p>'
    document_xml += '</w:body></w:document>'

    with zipfile.ZipFile(path, 'w') as zf:
        zf.writestr('word/document.xml', document_xml)


class TestReadDocx:
    def test_reads_single_paragraph(self, tmp_path):
        docx_path = str(tmp_path / "single.docx")
        create_test_docx(["Hello World"], docx_path)
        result = read_docx(docx_path)
        assert "Hello World" in result

    def test_reads_multiple_paragraphs(self, tmp_path):
        docx_path = str(tmp_path / "multi.docx")
        create_test_docx(["First paragraph", "Second paragraph", "Third paragraph"], docx_path)
        result = read_docx(docx_path)
        assert "First paragraph" in result
        assert "Second paragraph" in result
        assert "Third paragraph" in result

    def test_paragraphs_separated_by_newlines(self, tmp_path):
        docx_path = str(tmp_path / "newlines.docx")
        create_test_docx(["Line one", "Line two"], docx_path)
        result = read_docx(docx_path)
        lines = result.split('\n')
        assert len(lines) >= 2

    def test_handles_empty_document(self, tmp_path):
        docx_path = str(tmp_path / "empty.docx")
        document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        document_xml += '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body></w:body></w:document>'
        with zipfile.ZipFile(docx_path, 'w') as zf:
            zf.writestr('word/document.xml', document_xml)
        result = read_docx(docx_path)
        assert result.strip() == ""

    def test_handles_multiple_runs_in_paragraph(self, tmp_path):
        docx_path = str(tmp_path / "multi_runs.docx")
        document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        document_xml += '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
        document_xml += '<w:p><w:r><w:t>Hello </w:t></w:r><w:r><w:t>World</w:t></w:r></w:p>'
        document_xml += '</w:body></w:document>'
        with zipfile.ZipFile(docx_path, 'w') as zf:
            zf.writestr('word/document.xml', document_xml)
        result = read_docx(docx_path)
        assert "Hello World" in result

    def test_returns_error_for_nonexistent_file(self):
        result = read_docx("/nonexistent/path/file.docx")
        assert "Error reading" in result

    def test_returns_error_for_invalid_zip(self, tmp_path):
        invalid_path = str(tmp_path / "invalid.docx")
        with open(invalid_path, 'w') as f:
            f.write("this is not a zip file")
        result = read_docx(invalid_path)
        assert "Error reading" in result

    def test_handles_empty_text_elements(self, tmp_path):
        docx_path = str(tmp_path / "empty_text.docx")
        document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        document_xml += '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
        document_xml += '<w:p><w:r><w:t></w:t></w:r><w:r><w:t>Content</w:t></w:r></w:p>'
        document_xml += '</w:body></w:document>'
        with zipfile.ZipFile(docx_path, 'w') as zf:
            zf.writestr('word/document.xml', document_xml)
        result = read_docx(docx_path)
        assert "Content" in result

    def test_returns_string_type(self, tmp_path):
        docx_path = str(tmp_path / "type_test.docx")
        create_test_docx(["Test"], docx_path)
        result = read_docx(docx_path)
        assert isinstance(result, str)

    def test_handles_unicode_content(self, tmp_path):
        docx_path = str(tmp_path / "unicode.docx")
        create_test_docx(["Unicode: cafe"], docx_path)
        result = read_docx(docx_path)
        assert "Unicode: cafe" in result
