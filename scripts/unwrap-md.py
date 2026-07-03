#!/usr/bin/env python3
"""Convert hard-wrapped markdown to soft-wrapped (one line per paragraph).

Leaves untouched: YAML frontmatter, fenced code blocks, tables, headings,
blockquotes, list items (continuation lines are joined into their item),
horizontal rules, and blank lines.

Usage:
  scripts/unwrap-md.py file.md [more.md ...]   # rewrites in place
  scripts/unwrap-md.py --check file.md          # exit 1 if changes needed, no write
"""

import re
import sys

LIST_RE = re.compile(r"^(\s*)([-*+]|\d+[.)])\s+")
UNTOUCHABLE_RE = re.compile(r"^(\s{0,3}#{1,6}\s|\s*\||\s{4,}|\t|(\s*([-*_])\s*){3,}$)")


def unwrap(text: str) -> str:
    lines = text.split("\n")
    out = []
    i = 0
    n = len(lines)

    # frontmatter
    if lines and lines[0].strip() == "---":
        out.append(lines[0])
        i = 1
        while i < n:
            out.append(lines[i])
            if lines[i].strip() == "---":
                i += 1
                break
            i += 1

    in_fence = False
    buf = []  # current joinable paragraph/list-item lines

    def flush():
        if buf:
            out.append(" ".join(s.strip() for s in buf))
            buf.clear()

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```") or stripped.startswith("~~~"):
            flush()
            in_fence = not in_fence
            out.append(line)
        elif in_fence:
            out.append(line)
        elif not stripped:
            flush()
            out.append(line)
        elif stripped.startswith(">"):
            # join consecutive blockquote lines
            flush()
            quote = [stripped.lstrip("> ").strip()]
            while i + 1 < n and lines[i + 1].strip().startswith(">"):
                i += 1
                quote.append(lines[i].strip().lstrip("> ").strip())
            out.append("> " + " ".join(q for q in quote if q))
        elif UNTOUCHABLE_RE.match(line):
            flush()
            out.append(line)
        elif LIST_RE.match(line):
            flush()
            buf.append(line.rstrip())
        else:
            if buf and LIST_RE.match(buf[0]):
                # continuation of a list item keeps the marker line's text
                buf.append(line)
            else:
                buf.append(line)
        i += 1

    flush()
    return "\n".join(out)


def main():
    args = sys.argv[1:]
    check = "--check" in args
    files = [a for a in args if a != "--check"]
    if not files:
        print(__doc__)
        sys.exit(2)

    changed = []
    for path in files:
        with open(path, encoding="utf-8") as f:
            original = f.read()
        result = unwrap(original)
        if result != original:
            changed.append(path)
            if not check:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(result)

    for p in changed:
        print(("would change: " if check else "unwrapped: ") + p)
    if not changed:
        print("no changes needed")
    sys.exit(1 if (check and changed) else 0)


if __name__ == "__main__":
    main()
