const fs = require('fs');
const path = require('path');

const emojiToLucide = {
  '📊': 'BarChart',
  '👥': 'Users',
  '🗂': 'FolderOpen',
  '⏳': 'Hourglass',
  '🔒': 'Lock',
  '🔔': 'Bell',
  '⚙️': 'Settings',
  '⚙': 'Settings',
  '⭐': 'Star',
  '🛡️': 'ShieldCheck',
  '🛡': 'ShieldCheck',
  '⚡': 'Zap',
  '🏘️': 'Building',
  '🏘': 'Building',
  '🎧': 'Headphones',
  '🏷️': 'Tag',
  '🏷': 'Tag',
  '✨': 'Sparkles',
  '📍': 'MapPin',
  '💰': 'BadgeDollarSign',
  '🏠': 'Home',
  '📌': 'Pin',
  '📐': 'Maximize',
  '📷': 'Camera',
  '💡': 'Lightbulb',
  '🎯': 'Target',
  '💬': 'MessageSquare',
  '✈️': 'Send',
  '✈': 'Send',
  '🛏️': 'Bed',
  '🛏': 'Bed',
  '🚿': 'Bath',
  '🛋️': 'Armchair',
  '🛋': 'Armchair',
  '🧑': 'User',
  '🚻': 'Users',
  '📅': 'Calendar',
  '🚚': 'Truck',
  '🧰': 'Briefcase',
  '⚖️': 'Scale',
  '⚖': 'Scale',
  '🔖': 'Bookmark',
  '⏱️': 'Timer',
  '⏱': 'Timer',
  '🛣️': 'Map',
  '🛣': 'Map'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const usedIcons = new Set();
  let newContent = content;

  for (const [emoji, iconName] of Object.entries(emojiToLucide)) {
    if (newContent.includes(emoji)) {
      usedIcons.add(iconName);
      // We must handle cases where the emoji is optionally wrapped in quotes
      const regexQuote = new RegExp(`['"\`]?${emoji}['"\`]?`, 'g');
      newContent = newContent.replace(regexQuote, `<${iconName} size={16} />`);
    }
  }

  if (usedIcons.size > 0) {
    const imports = Array.from(usedIcons).join(', ');
    const importStmt = `import { ${imports} } from 'lucide-react';\n`;
    
    const lastImportIndex = newContent.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = newContent.indexOf('\n', lastImportIndex);
      if (endOfLastImport !== -1) {
          newContent = newContent.slice(0, endOfLastImport + 1) + importStmt + newContent.slice(endOfLastImport + 1);
      } else {
          newContent = importStmt + newContent;
      }
    } else {
      newContent = importStmt + newContent;
    }
    
    fs.writeFileSync(f, newContent);
    console.log(`Updated ${f}`);
  }
});

console.log('Finished updating icons.');
