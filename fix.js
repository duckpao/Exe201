const fs = require('fs');
let c = fs.readFileSync('E:/Exe201/frontend/src/pages/SettingsPage.jsx', 'utf8');

c = c.replace(/fetch\(`\$\{apiUrl\}\/api\/favorites`\)/g, "fetch(`${apiUrl}/api/favorites`, { credentials: 'include' })");
c = c.replace(/fetch\(`\$\{apiUrl\}\/api\/users\/listings`\)/g, "fetch(`${apiUrl}/api/users/listings`, { credentials: 'include' })");
c = c.replace(/fetch\(`\$\{apiUrl\}\/api\/users\/listings\/\$\{type\}\/\$\{id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)/g, "fetch(`${apiUrl}/api/users/listings/${type}/${id}`, { method: 'DELETE', credentials: 'include' })");
c = c.replace(/fetch\(`\$\{apiUrl\}\/api\/users\/profile`,\s*\{/g, "fetch(`${apiUrl}/api/users/profile`, { credentials: 'include',");
c = c.replace(/fetch\(`\$\{apiUrl\}\/api\/users\/password`,\s*\{/g, "fetch(`${apiUrl}/api/users/password`, { credentials: 'include',");

fs.writeFileSync('E:/Exe201/frontend/src/pages/SettingsPage.jsx', c);
console.log('Done');
