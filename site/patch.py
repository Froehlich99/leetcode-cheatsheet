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

edit("src/components/App/App.tsx", "import '@styles/styles.sass'", "import '@styles/styles.sass'\nimport '@styles/clean.css'")
edit("src/components/Sidebar/SidebarProvider.tsx", "useState(true)", 'useState(() => typeof window !== "undefined" && window.innerWidth > 768)')
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "import styles from './LinkWithTooltip.module.sass'", "import styles from './LinkWithTooltip.module.sass'\nimport { useSidebar } from '@components/Sidebar/SidebarProvider'")
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "    let hoverTimer: NodeJS.Timeout", "    const { hideSidebar } = useSidebar()\n    let hoverTimer: NodeJS.Timeout")
edit("src/components/LinkWithTooltip/LinkWithTooltip.tsx", "        scrollTo(href, getNavBarHeight() - 2)", "        scrollTo(href, getNavBarHeight() - 2)\n        if (window.innerWidth <= 768) hideSidebar()")
edit("src/components/Topbar/Topbar.tsx", "href=\"/leetcode-cheatsheet\"", 'href="https://github.com/Froehlich99/leetcode-cheatsheet"')
edit("src/components/Topbar/Topbar.tsx", "        <header ref={ref}", "        <header ref={ref}") if False else None
edit("index.html", '<html lang="en" data-theme="light">', '<html lang="en" data-theme="dark">')
edit("index.html", '<title>LeetCode Cheatsheet</title>', '<title>LeetCode Cheatsheet</title>\n    <meta name="theme-color" content="#111318" />')
(root / "src/styles/clean.css").write_text((Path(__file__).parent / "clean.css").read_text())
(root / "public/.nojekyll").write_text("")
print("Applied clean theme; upstream algorithm templates and MIT license retained.")
