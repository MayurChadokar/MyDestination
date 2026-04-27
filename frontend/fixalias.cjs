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
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const getRelativePath = (fromFile, toAliasTarget) => {
  const fromDir = path.dirname(fromFile);
  // Assume @/ maps to c:/Users/Ishaa/Desktop/CompanyProjects/RukkooIn/frontend/src/modules/wedding-integrated/
  const targetPath = path.join('c:/Users/Ishaa/Desktop/CompanyProjects/RukkooIn/frontend/src/modules/wedding-integrated', toAliasTarget);
  let rel = path.relative(fromDir, targetPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
};

const fixAliases = (dir) => {
  const files = walk(dir);
  files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;
    
    // Replace @/lib/utils, @/components/ui/..., @/hooks/...
    content = content.replace(/['"]@\/([^'"]+)['"]/g, (match, p1) => {
      changed = true;
      let target = p1;
      // Special case: we moved lib/utils to components/utils
      if (p1 === 'lib/utils') target = 'components/utils';
      return '"' + getRelativePath(f, target) + '"';
    });

    if (changed) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('Fixed aliases in:', f);
    }
  });
};

fixAliases('c:/Users/Ishaa/Desktop/CompanyProjects/RukkooIn/frontend/src/modules/wedding-integrated/components/ui');
fixAliases('c:/Users/Ishaa/Desktop/CompanyProjects/RukkooIn/frontend/src/modules/wedding-integrated/vendor');
