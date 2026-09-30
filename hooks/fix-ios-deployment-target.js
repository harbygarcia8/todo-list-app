'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const pkg = path.join(
    context.opts.projectRoot,
    'platforms/ios/packages/cordova-ios-plugins/Package.swift',
  );
  if (!fs.existsSync(pkg)) {
    return;
  }
  const original = fs.readFileSync(pkg, 'utf8');
  const patched = original
    .replace(/\.iOS\("(?:11|13)\.0"\)/g, '.iOS("15.0")')
    .replace(/\.macCatalyst\("(?:11|13)\.0"\)/g, '.macCatalyst("15.0")');
  if (patched !== original) {
    fs.writeFileSync(pkg, patched, 'utf8');
    console.log('[hook] iOS deployment target elevado a 15.0 (compat. Xcode 26+)');
  }
};
