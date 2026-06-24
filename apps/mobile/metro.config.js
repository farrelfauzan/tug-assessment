const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];
config.resolver.unstable_enableSymlinks = true;
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-web': path.resolve(projectRoot, 'node_modules/react-native-web')
};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(projectRoot, 'node_modules/react/index.js')
    };
  }

  if (moduleName === 'react/jsx-runtime') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(projectRoot, 'node_modules/react/jsx-runtime.js')
    };
  }

  if (moduleName === 'react/jsx-dev-runtime') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(projectRoot, 'node_modules/react/jsx-dev-runtime.js')
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
