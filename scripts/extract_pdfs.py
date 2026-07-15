import fitz, sys

print("=== PDF 1: Sitemap & Architecture ===")
doc = fitz.open("/Users/patmini/Downloads/Let's build this site map and architecture diagram.pdf")
print('Pages:', len(doc))
for i, page in enumerate(doc):
    text = page.get_text()
    print(f'\n--- Page {i+1} ---')
    print(text[:3000])

print("\n\n=== PDF 2: Create site map ===")
doc2 = fitz.open("/Users/patmini/Downloads/Create site map for this.pdf")
print('Pages:', len(doc2))
for i, page in enumerate(doc2):
    text = page.get_text()
    print(f'\n--- Page {i+1} ---')
    print(text[:3000])
