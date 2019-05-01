const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports =  function override(config, env) {
    config.plugins = config.plugins.map(p => {

        if(p.constructor.name === 'GenerateSW') {
            return new WorkboxWebpackPlugin.InjectManifest({
                swSrc: './src/sw.js',
                swDest: 'service-worker.js'
              })
        }
        return p
    })

    return config
}