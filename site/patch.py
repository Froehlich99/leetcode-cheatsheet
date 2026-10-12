#!/usr/bin/env python3
"""Non-destructive visual overrides for the original MIT-licensed cheatsheet."""
import sys
from pathlib import Path

root = Path(sys.argv[1])

def edit(name, a, b):
    path = root / name
    data = path.read_text()
    if a not in data:
        raise RuntimeError(f"Upstream changed, expected marker missing: {name}")
    path.write_text(data.replace(a, b, 1))

edit("src/components/App/App.tsx", "import '@styles/styles.sass'", "import '@styles/styles.sass'\nimport '@styles/atlas.css'")
edit("src/components/Sidebar/SidebarProvider.tsx", "useState(true)", 'useState(() => typeof window !== "undefined" && window.innerWidth > 768)')
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "import styles from './LinkWithTooltip.module.sass'", "import styles from './LinkWithTooltip.module.sass'\nimport { useSidebar } from '@components/Sidebar/SidebarProvider'")
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "    let hoverTimer: NodeJS.Timeout", "    const { hideSidebar } = useSidebar()\n    let hoverTimer: NodeJS.Timeout")
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "        scrollTo(href, getNavBarHeight() - 2)", "        scrollTo(href, getNavBarHeight() - 2)\n        if (window.innerWidth <= 768) hideSidebar()")
edit("src/components/Topbar/Topbar.tsx", "href=\"/leetcode-cheatsheet\"", 'href="https://github.com/Froehlich99/leetcode-cheatsheet"')
edit("src/components/Topbar/Topbar.tsx", "        <header ref={ref}", "        <header ref={ref}") if False else None
edit("index.html", '<html lang="en" data-theme="light">', '<html lang="en" data-theme="dark">')
edit("index.html", '<title>LeetCode Cheatsheet</title>', '<title>LeetCode Cheatsheet</title>\n    <meta name="theme-color" content="#111214" />')
# Upstream contains mixed-case .sass imports that fail on Linux runners.
# Resolve them against the actual filenames without modifying any algorithm code.
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

(root / "src/styles/clean.css").write_text((Path(__file__).parent / "clean.css").read_text())
# Replace the original layout with the real minimal UI shown in the previews.
# Keep upstream section components, templates, charts and tables intact.
components = {
  "src/components/Content/Content.tsx": "Content.tsx",
  "src/components/Topbar/Topbar.tsx": "Topbar.tsx",
  "src/components/AppBar/AppBar.tsx": "Appbar.tsx",
  "src/components/Sidebar/Sidebar.tsx": "Sidebar.tsx",
  "src/components/ThemeSwitch/ThemeSwitch.tsx": "ThemeSwitch.tsx",
  "src/components/Topbar/SearchDialog.tsx": "SearchDialog.tsx",
  "src/components/Code/Code.tsx": "Code.tsx",
  "src/components/Tabs/Tabs.tsx": "Tabs.tsx",
}
for destination, source in components.items():
    (root / destination).write_text((Path(__file__).parent / source).read_text())
(root / "src/styles/atlas.css").write_text((Path(__file__).parent / "atlas.css").read_text())
app = root / "src/components/App/App.tsx"
code = app.read_text().replace("import '@styles/clean.css'", "import '@styles/atlas.css'")
# Upstream background animation is no longer needed.
code = code.replace('<Background />','')
app.write_text(code)

(root / "public/.nojekyll").write_text("")
print("Applied clean theme; upstream algorithm templates and MIT license retained.")
