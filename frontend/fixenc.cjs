const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
};

const map = {
  'â€¢': '•',
  'â‚¹': '₹',
  'ðŸŒ¸': '🌸',
  'ðŸ’«': '💫',
  'ðŸ‘‘': '👑',
  'â€“': '–',
  'â€™': '’'
};

const files = walk('c:/Users/Ishaa/Desktop/CompanyProjects/RukkooIn/frontend/src/modules/wedding-integrated');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  for (let key in map) {
    if (content.includes(key)) {
      content = content.split(key).join(map[key]);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed:', f);
  }
});
