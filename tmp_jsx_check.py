from pathlib import Path
import re
p = Path('src/pages/Dashboard.jsx')
text = p.read_text(encoding='utf-8')
lines = text.splitlines()
open_tags = []
self_closing = {'input','img','br','hr','meta','link'}
for i,line in enumerate(lines,1):
    for m in re.finditer(r'<(/?)([A-Za-z][A-Za-z0-9_-]*)([^>]*)>', line):
        closing = m.group(1) == '/'
        tag = m.group(2)
        rest = m.group(3)
        if closing:
            if open_tags and open_tags[-1] == tag:
                open_tags.pop()
            else:
                print('mismatch close', tag, 'line', i, 'stack', open_tags)
        else:
            if tag not in self_closing and not rest.strip().endswith('/'):
                open_tags.append(tag)
print('remaining', open_tags)
