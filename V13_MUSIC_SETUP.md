# V13 — Music Edition

The selected audio is stored locally at:

    assets/audio/our-song.mp3

It is served through the same authenticated Node server as the private photos.

Behavior:
- The first tap/click on the Blossom page attempts to start the song.
- A floating music button lets the visitor play/pause at any time.
- Music fades in gently to about 34% volume.
- It loops when it reaches the end.
- It continues while moving between Blossom, Love Letter and Memories because those are sections of one page.
- Mobile browsers may require the visitor's first interaction before sound is allowed; this is normal browser behavior.

Run V13 exactly like V12:
1. Set BLOSSOM_PASSWORD locally.
2. Run `node server.js`.
3. Forward port 5500.
4. Use the forwarded URL.

Do not use Live Server for the protected version.
