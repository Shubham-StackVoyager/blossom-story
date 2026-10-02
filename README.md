# Blossom Story V8 — Personal Photos + 10 Memory Slots

Included:
- The 4 uploaded photos are added as memory-01.jpg through memory-04.jpg.
- Images are resized/compressed for faster web/mobile loading.
- 10 total memory positions are prepared.
- Slots 5–10 remain elegant future-photo placeholders.
- Real photos use lazy loading and async decoding.
- Existing optimized Blossom → Love Letter → Memories flow remains intact.

To add future photos:
1. Put the image in assets/images/ as memory-05.jpg, memory-06.jpg, etc.
2. In index.html, replace that slot's `photo-placeholder` div with:
   <img src="assets/images/memory-05.jpg" alt="Memory 5" loading="lazy" decoding="async">
3. Change its date/title/message text.


V9: Added generic romantic captions to memories 1–4. They are intentionally not based on the visual content of the photos and can be edited later.

V10:
- Reworked the Love Letter into a warmer, generic romantic message.
- Added a highlighted intimate closing thought.
- Improved long-letter scrolling while preserving mobile support.
- Kept all V9 photos, captions, 10 memory slots, performance fixes and envelope animation.
- Replace "Your Name" later with the desired signature.


V12 FIXED — complete package
- Restored style.css and script.js.
- Restored assets/images with memory-01.jpg through memory-04.jpg.
- Preserved the V10 Love Letter and V9 romantic memory captions.
- Added the V12 server-side password gate in server.js.
- Added privacy/no-index metadata.
- Slots 05–10 remain available for future photos.
- IMPORTANT: use `node server.js`, not Live Server, for the protected version.
