# Sand Sails web release

Desktop and Android WebGPU browser build, published to GitHub Pages by Actions on push to main.
[Play Sand Sails](https://jkeywo.github.io/sand-sails-web/) ·
[Controller check](https://jkeywo.github.io/sand-sails-web/controller.html).
Open the Pages URL in current desktop Chrome or Edge and click Start. The Sailing
Guide opens on the current controls; Enter, Escape, A or B resumes sailing. F7 cycles
the four visual styles; M opens Settings. The first visit reloads once so Unreal's
native service worker can provide cross-origin isolation for Wasm threads.

Android Chrome is the first mobile target (Pixel 8a). Touch controls appear on
touch-first devices: left stick steers and trims, right stick moves the camera.
Hold the arrow above/right of the camera stick for thrust, or the brake bars
below/left to brake/reverse. Tap the screen centre to raise/lower the sail or
accept the current delivery/race bubble. Menu is top left; fullscreen is top
right. Mobile play is landscape only; portrait shows a rotate prompt. The guide
opens with touch instructions.

Unreal selects BC textures on desktop GPUs and ASTC on compatible phone GPUs;
each visit downloads one texture set. Physical-phone performance still needs
device testing. iPhone/iPad Safari is not yet a verified target for this release.

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
