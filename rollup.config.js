import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const LIBRARY_NAME = 'PubSub';

const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 * @license ${pkg.license}
 */`;

const makeConfig = (env = 'development') => {
  let bundleSuffix = '';

  if (env === 'production') {
    bundleSuffix = 'min.';
  }

  const config = {
    input: 'src/index.js',
    output: [
      {
        banner,
        name: LIBRARY_NAME,
        file: `dist/${LIBRARY_NAME}.umd.${bundleSuffix}js`, // UMD
        format: 'umd',
        exports: 'auto'
      },
      {
        banner,
        file: `dist/${LIBRARY_NAME}.cjs.${bundleSuffix}js`, // CommonJS
        format: 'cjs',
        exports: 'default'
      },
      {
        banner,
        file: `dist/${LIBRARY_NAME}.esm.${bundleSuffix}js`, // ESM
        format: 'es',
        exports: 'auto'
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**']
      })
    ]
  };

  if (env === 'production') {
    config.plugins.push(terser({
      output: {
        comments: /^!/
      }
    }));
  }

  return config;
};

export default commandLineArgs => {
  const configs = [
    makeConfig()
  ];

  // Production
  if (commandLineArgs.environment === 'BUILD:production') {
    configs.push(makeConfig('production'));
  }

  return configs;
};
