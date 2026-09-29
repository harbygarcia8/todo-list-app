'use strict';

/**
 * Hook de Cordova (after_prepare / after_platform_add) para iOS.
 *
 * cordova-ios 8 genera `platforms/ios/packages/cordova-ios-plugins/Package.swift`
 * con un deployment target antiguo (`iOS 11.0` / `macCatalyst 11.0`). Xcode 26
 * solo admite deployment targets >= 15.0 (rango soportado 15.0–27.0) y rechaza
 * cualquier valor por debajo.
 *
 * Este hook eleva ese mínimo a 15.0 de forma automática y reproducible, para
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
    .replace(/\.iOS\("(?:11|13)\.0"\)/g, '.iOS("15.0")')
    .replace(/\.macCatalyst\("(?:11|13)\.0"\)/g, '.macCatalyst("15.0")');
  if (patched !== original) {
    fs.writeFileSync(pkg, patched, 'utf8');
    console.log('[hook] iOS deployment target elevado a 15.0 (compat. Xcode 26+)');
  }
};
