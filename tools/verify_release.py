"""Check release bytes after Git checkout, before uploading a Pages artifact."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
site = root/'site'
expected = json.loads((root/'release-files.json').read_text())
actual = {p.relative_to(site).as_posix() for p in site.rglob('*') if p.is_file()}
assert actual == set(expected), f'Release file list differs: {actual ^ set(expected)}'
for relative, info in expected.items():
    path = site/relative
    assert not path.is_symlink(), f'Symlink: {relative}'
    assert path.stat().st_size == info['size'], f'Size mismatch: {relative}'
    assert hashlib.sha256(path.read_bytes()).hexdigest() == info['sha256'], f'Hash mismatch: {relative}'
    assert info['size'] < 100*1024*1024, f'File too large for Git: {relative}'
print(f'Verified {len(expected)} release files, {sum(x["size"] for x in expected.values()):,} static bytes.')
