const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = config => {
    config.optimization.runtimeChunk = false; // required for MF to work
    config.plugins.push(
        new ModuleFederationPlugin({
            name: "angular-host",
            shared: {
                "@angular/core": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/common": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/common/http": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/router": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },

                "@angular/compiler": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/cdk": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },

                "@angular/animations": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/platform-browser": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
                "@angular/platform-browser-dynamic": { strictVersion: true, requiredVersion: ">=14.1.0", singleton: true },
            }
        }),
    );
    return config;
}