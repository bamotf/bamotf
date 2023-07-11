/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  tailwind: true,
  ignoredRouteFiles: ['**/.*', '**/*.test.ts'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: ['logger'],
  postcss: true,
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_headers: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_dev: true,
  },
}
