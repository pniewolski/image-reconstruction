import path from 'path';

export default {
    entry: './src/js/App.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: 'C:\\ctsim\\compiledSource\\',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        contentBase: './dist',
    },
};
