#!/usr/bin/env python3
import sys
from pathlib import Path
root = Path(sys.argv[1])
import re
for source in root.rglob("*"):
    if source.suffix not in (".tsx", ".ts", ".jsx", ".js"):
        continue
    data = source.read_text()
    def normalize(match):
        quote, original = match.groups()
        target = source.parent / original
        if target.exists() or any(Path(str(target) + ext).exists() for ext in (".tsx", ".ts", ".js", ".jsx")):
            return match.group(0)
        parent = target.parent
        if not parent.is_dir():
            return match.group(0)
        name = target.name
        candidates = [item for item in parent.iterdir() if item.is_file()]
        resolved = next((item.name for item in candidates if item.name.lower() == name.lower()), None)
        if resolved is None and not target.suffix:
            resolved = next((item.stem for item in candidates if item.stem.lower() == name.lower() and item.suffix in (".tsx", ".ts", ".js", ".jsx")), None)
        if not resolved:
            return match.group(0)
        fixed = original[:-len(name)] + resolved
        return quote + fixed + quote
    updated = re.sub(r"""(['"])(\./[^'"]+)\1""", normalize, data)
    if updated != data:
        source.write_text(updated)
        print("Normalized relative imports in", source.relative_to(root))

