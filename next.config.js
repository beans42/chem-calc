const withPreact = require('next-plugin-preact');
const withPlugins = require('next-compose-plugins');

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const BASE_PATH = '/chem-calc'; //change in public/manifest.json as well

const plugins = [
	withPreact({
		reactStrictMode: true,
		experimental: {
			modern: true
		}
	}),
	withPWA({
		pwa: {
			dest: 'public',
			runtimeCaching,
			scope: BASE_PATH
		}
	})
];

module.exports = withPlugins([...plugins], {
	assetPrefix: BASE_PATH,
	basePath: BASE_PATH
});