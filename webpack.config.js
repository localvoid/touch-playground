const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["es2015", "es2016"],
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["es2015", "es2016"],
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            configFileName: "tsconfig.json",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "__IVI_DEV__": true,
            "__IVI_BROWSER__": true,
        }),
        new webpack.SourceMapDevToolPlugin({
            test: /\.(ts|js)$/,
        }),
    ],
    resolve: {
        extensions: [".ts", ".js"],
    },
    devServer: {
        port: 9000,
        host: "0.0.0.0",
        historyApiFallback: true,
        noInfo: false,
        stats: "minimal",
        contentBase: path.join(__dirname, "public"),
    },
};
