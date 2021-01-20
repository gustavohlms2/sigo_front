const path = require('path');
module.exports = {    
    devServer: {       
        proxy: {
            '/api': {
                target: 'http://localhost:5050'
            }
        },         
    },
    outputDir: path.resolve(__dirname, '../server/public')
}