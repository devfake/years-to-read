module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: {
    output: {
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json'
    }
  },
  css: {
    extract: false
  }
}
