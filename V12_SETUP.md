# V12 Private Password Edition

IMPORTANT: Do NOT use Live Server for V12. `node server.js` replaces it.

## Step 1 — Check Node
Open a NEW PowerShell terminal in VS Code:

    node --version

## Step 2 — Set your private password
Use your own strong password. Do not send it to ChatGPT or put it in screenshots:

    $env:BLOSSOM_PASSWORD="YOUR-OWN-LONG-PRIVATE-PASSWORD"

The password exists only in that PowerShell process/environment; it is not written into the website files.

## Step 3 — Start the server

    node server.js

Then open:

    http://127.0.0.1:5500

You should see the new Private Garden login page.

## Step 4 — VS Code Port Forwarding
Forward port 5500 as before.

For the intended person to reach OUR password page without signing into your GitHub/Microsoft account, the Dev Tunnel must be reachable publicly. That means anyone who obtains the tunnel URL can reach the PASSWORD SCREEN, but V12 prevents unauthenticated visitors from receiving the Blossom HTML, JS, CSS, or private photos.

Use a strong unique password and only share the URL/password with the intended recipient.

## Session behavior
Successful login creates a secure HttpOnly cookie lasting up to 7 days in that browser. However, sessions are stored in server memory. If you stop/restart `node server.js`, existing sessions are cleared and the password must be entered again.

## Stop sharing
Press Ctrl+C in the terminal and/or stop forwarding port 5500.

## Security notes
- Server-side password check; password is not in index.html/script.js.
- Private image routes are behind the same authentication check.
- 10 failed attempts per IP per 15 minutes.
- HttpOnly + Secure + SameSite=Strict session cookie.
- noindex/noarchive response headers.
- Anyone authorized to view an image can still screenshot/save it.
