// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "CordovaPluginPurchase",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CordovaPluginPurchase",
            targets: ["CordovaPluginPurchase"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.4.2")
    ],
    targets: [
        .target(
            name: "CordovaPluginPurchase",
            dependencies: [
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: ".",
            publicHeadersPath: "."
        )
    ]
)