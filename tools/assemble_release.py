"""Reassemble Git-friendly payload chunks before Pages integrity checks/upload."""
import hashlib
import json
from pathlib import Path

root=Path(__file__).resolve().parent.parent
for relative,entry in json.loads((root/'payload-map.json').read_text()).items():
    destination=root/'site'/relative
    assert (root/'site').resolve() in destination.resolve().parents
    destination.parent.mkdir(parents=True,exist_ok=True)
    temporary=destination.with_name(destination.name+'.assembling')
    digest=hashlib.sha256()
    size=0
    with temporary.open('wb') as output:
        for part in entry['parts']:
            path=root/part['path']
            assert (root/'payload').resolve() in path.resolve().parents
            data=path.read_bytes()
            assert hashlib.sha256(data).hexdigest()==part['sha256'],f'Chunk hash mismatch: {path}'
            output.write(data);digest.update(data);size+=len(data)
    assert size==entry['size'] and digest.hexdigest()==entry['sha256'],f'Reassembled hash mismatch: {relative}'
    temporary.replace(destination)
    print(f'Reassembled {relative}: {size:,} identical bytes.')
