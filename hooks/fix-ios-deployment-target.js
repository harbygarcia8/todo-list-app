'use strict';

/**
 * Hook de Cordova (after_prepare / after_platform_add) para iOS.
 *
 * cordova-ios 8 genera `platforms/ios/packages/cordova-ios-plugins/Package.swift`
 * con un deployment target antiguo (`iOS 11.0` / `macCatalyst 11.0`). Xcode
 * reciente (26+) rechaza `macCatalyst 11.0`:
 *   "invalid macCatalyst version 11.0; the minimum major version should be 13".
 *
 * Este hook eleva ese mínimo a 13.0 de forma automática y reproducible, para
 * que `cordova build ios` funcione sin editar archivos generados a mano.
 */
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
    .replace(/\.iOS\("11\.0"\)/g, '.iOS("13.0")')
    .replace(/\.macCatalyst\("11\.0"\)/g, '.macCatalyst("13.0")');
  if (patched !== original) {
    fs.writeFileSync(pkg, patched, 'utf8');
    console.log('[hook] iOS deployment target elevado a 13.0 (compat. Xcode 26+)');
  }
};
