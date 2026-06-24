import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = tree.findall('.//w:p', namespaces)
            
            full_text = []
            for p in paragraphs:
                texts = p.findall('.//w:t', namespaces)
                p_text = ''.join([t.text for t in texts if t.text])
                full_text.append(p_text)
                
            return '\n'.join(full_text)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

if len(sys.argv) > 1:
    print(read_docx(sys.argv[1]))
