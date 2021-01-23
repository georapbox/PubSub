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

export default commandLineArgs => {
  const configs = [
    {
      input: 'src/index.js',
      output: [
        {
          banner,
          name: LIBRARY_NAME,
          file: `dist/${LIBRARY_NAME}.umd.js`, // UMD
          format: 'umd',
          exports: 'auto'
        },
        {
          banner,
          file: `dist/${LIBRARY_NAME}.cjs.js`, // CommonJS
          format: 'cjs',
          exports: 'default'
        },
        {
          banner,
          file: `dist/${LIBRARY_NAME}.esm.js`, // ESM
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
    }
  ];

  // Production
  if (commandLineArgs.environment === 'BUILD:production') {
    configs.push({
      input: 'src/index.js',
      output: [
        {
          banner,
          name: LIBRARY_NAME,
          file: `dist/${LIBRARY_NAME}.umd.min.js`, // UMD
          format: 'umd',
          exports: 'auto'
        },
        {
          banner,
          file: `dist/${LIBRARY_NAME}.cjs.min.js`, // CommonJS
          format: 'cjs',
          exports: 'default'
        },
        {
          banner,
          file: `dist/${LIBRARY_NAME}.esm.min.js`, // ESM
          format: 'es',
          exports: 'auto'
        }
      ],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: ['node_modules/**']
        }),
        terser({
          output: {
            comments: /^!/
          }
        })
      ]
    });
  }

  return configs;
};
