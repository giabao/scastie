const Path = require('path');
const { merge } = require("webpack-merge");

const generatedConfig = require('./scalajs.webpack.config');

const rootDir = Path.resolve(__dirname, '../../../..');
const resourcesDir = Path.resolve(rootDir, 'src/main/resources');

/** Convert webpack config from old style to new style:
 * + Use output.library.type instead of outputlibrarytarget.
 *   https://webpack.js.org/configuration/output/#outputlibrarytarget
 * + Use EntryDescription object
 *   https://webpack.js.org/concepts/entry-points/#entrydescription-object
 * Example
 * {
 *    output: { library: "lib", libraryTarget: "var", others },
 *    entry: { foo: ["foo.js"] }
 * } is converted to: {
 *    output: { others },
 *    entry: { foo: {
 *      import: ["foo.js"],
 *      library: { name: "lib", type: "var" }
 *    }}
 *  }
 * @param c the old style webpack config
 * @returns the new style webpack config
 * @note without this, all webpack output entries, ex embedded-library.js, app-library.js,..
 *       will re-assign ScalaJSBundlerLibrary
 */
function newStyleConfig(c) {
  if (! c.output.hasOwnProperty("library")) {
    return c
  }
  const library = {
    name: c.output.library,
    type: c.output.libraryTarget
  }
  delete c.output.library;
  delete c.output.libraryTarget;

  const entry = {};
  for(const [k, v] of Object.entries(c.entry)) {
    entry[k] = typeof v === "string" || Array.isArray(v) ?
        { import: v, library } : v;
  }
  return merge(c, { entry })
}

const ScalaJs = merge(newStyleConfig(generatedConfig), {
  resolve: {
    alias: {
      'resources': resourcesDir
    }
  },
  output: {
    assetModuleFilename: "[name].[hash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/resource',
      }
    ]
  }
});

const Web = {
  devtool: "source-map",
  resolve: {
    alias: {
      'resources': resourcesDir,
      'node_modules': Path.resolve(__dirname, 'node_modules')
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|woff|woff2|eot|ttf)$/,
        type: 'asset/resource',
      }
    ]
  }
}

module.exports = {
  rootDir: rootDir,
  resourcesDir: resourcesDir,
  Web: Web,
  ScalaJs: ScalaJs
}