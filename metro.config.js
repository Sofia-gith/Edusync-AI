const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para arquivos .db do WatermelonDB
config.resolver.assetExts.push('db');

// Adiciona suporte para extensões específicas do WatermelonDB
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs', // CommonJS modules
];

module.exports = config;