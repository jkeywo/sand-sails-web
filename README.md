# Sand Sails web release

Desktop WebGPU browser build, published to GitHub Pages by Actions on push to main.
Open the Pages URL in current desktop Chrome or Edge and click Start. F7 cycles
the four visual styles; M opens Settings. The first visit reloads once so Unreal's
native service worker can provide cross-origin isolation for Wasm threads.

This repository contains the compiled web release and its hosting adapter.
Unreal project source, editor assets, SDKs and private debug symbols are excluded.
GitHub Pages cannot negotiate our precompressed binary files, so a small pinned
Brotli decoder adapts network reads. Unreal retains cache integrity, range reads
and isolation. Dependencies and their licences are in site/vendor; engine/game
notices are in site/NOTICES.txt. No CDN scripts or runtime package downloads.

Large compressed files are stored as 2 MB chunks under payload/. Actions reassembles
and hash-checks the original site files before publishing. This also permits
resumable uploads over connections that struggle with large Git requests.

Updates: export a validated Shipping stage with Tools/prepare_github_pages.py in
the main Unreal workspace, commit the updated site and push. GitHub Actions only
publishes this ready-built site; it does not require Unreal or Emscripten.

Native-host measurements do not predict Pages startup timing. Download size and
controls are checked against the actual Pages URL after deployment.

Controller diagnostics: [browser input check](https://jkeywo.github.io/sand-sails-web/controller.html).
