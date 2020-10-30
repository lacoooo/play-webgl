const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const BUILD_PATH = path.resolve(__dirname, "../dist");


const options = {
 
  // Required

  // name of module like in package.json
  // - used to declare module & import/require
  name: 'cool-project',
  // path to entry-point (generated .d.ts file for main module)
  // if you want to load all .d.ts files from a path recursively you can use "path/project/**/*.d.ts"
  //  ^ *** Experimental, TEST NEEDED, see "All .d.ts files" section 
  // - either relative or absolute
  main: path.resolve(BUILD_PATH, "modules/*.d.ts"),

  // Optional

  // base directory to be used for discovering type declarations (i.e. from this project itself)
  // - default: dirname of main
  baseDir: path.resolve(BUILD_PATH, "modules"),
  // path of output file. Is relative from baseDir but you can use absolute paths. 
  // if starts with "~/" then is relative to current path. See https://github.com/TypeStrong/dts-bundle/issues/26
  //  ^ *** Experimental, TEST NEEDED    
  // - default: "<baseDir>/<name>.d.ts"
  out: 'dist/cool-project.d.ts',
  // include typings outside of the 'baseDir' (i.e. like node.d.ts)
  // - default: false
  externals: false,
  // reference external modules as <reference path="..." /> tags *** Experimental, TEST NEEDED
  // - default: false
  referenceExternals: false,
  // filter to exclude typings, either a RegExp or a callback. match path relative to opts.baseDir
  // - RegExp: a match excludes the file
  // - function: (file:String, external:Boolean) return true to exclude, false to allow
  // - always use forward-slashes (even on Windows)
  // - default: *pass*
  exclude: /^defs\/$/,
  // delete all source typings (i.e. "<baseDir>/**/*.d.ts")
  // - default: false
  removeSource: false,
  // newline to use in output file
  // newline: os.EOL,
  // indentation to use in output file
  // - default 4 spaces
  indent: '    ',
  // prefix for rewriting module names
  // - default ''
  prefix: '__',
  // separator for rewriting module 'path' names
  // - default: forward slash (like sub-modules)
  separator: '/',
  // enable verbose mode, prints detailed info about all references and includes/excludes
  // - default: false
  verbose: false,
  // emit although included files not found. See "Files not found" section. 
  // *** Experimental, TEST NEEDED
  // - default: false 
  emitOnIncludedFileNotFound: false,
  // emit although no included files not found. See "Files not found" section. 
  // *** Experimental, TEST NEEDED
  // - default: false     
  emitOnNoIncludedFileNotFound: false,    
  // output d.ts as designed for module folder. (no declare modules)
  outputAsModuleFolder: false,
  // path to file that contains the header
  // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
  // - default: null
  headerPath: "path/to/header/file",
  // text of the the header
  // doesn't work with headerPath
  // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
  // - default: ''
  headerTex: "" 
};



module.exports = {
  mode: "production",
  devtool: "",

  entry: {
    draw: path.resolve(BUILD_PATH, "draw.js"),
  },

  output: {
    library: "draw",
    libraryTarget: "umd",
    path: BUILD_PATH,
    filename: "draw.min.js",
  },

  resolve: {
    extensions: [".js"],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: false,
        parallel: false,
        terserOptions: {
          warnings: false,
          ie8: true,
        },
        extractComments: {
          condition: /@license/i,
          filename: (fileData) => {
            return `${fileData.filename}.LICENSE.txt${fileData.query}`;
          },
          banner: (licenseFile) => {
            return `License information can be found in ${licenseFile}`;
          },
        },
      })
    ],
  },

  plugins: [
    new TypedocWebpackPlugin({
      name: 'draw',
      out: '../docs',
      module: 'commonjs',
      target: 'es5',
      exclude: '**/node_modules/**/*.*',
      experimentalDecorators: true,
      excludeExternals: true
    }, '../src')
  ]
};
