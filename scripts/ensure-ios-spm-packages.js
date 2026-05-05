const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const packages = [
  {
    packageName: 'appsflyer-capacitor-plugin',
    productName: 'AppsflyerCapacitorPlugin',
    targetName: 'AppsFlyerPlugin',
    sourcePath: 'ios/Plugin',
    spmPath: 'ios/Sources/AppsFlyerPlugin',
    className: 'AppsFlyerPlugin',
    jsName: 'AppsFlyerPlugin',
    methods: [
      ['initSDK', 'promise'],
      ['logEvent', 'promise'],
      ['setCustomerUserId', 'none'],
      ['setCurrencyCode', 'none'],
      ['updateServerUninstallToken', 'none'],
      ['setAppInviteOneLink', 'none'],
      ['setOneLinkCustomDomain', 'none'],
      ['appendParametersToDeepLinkingURL', 'none'],
      ['setResolveDeepLinkURLs', 'none'],
      ['addPushNotificationDeepLinkPath', 'none'],
      ['setSharingFilter', 'none'],
      ['setSharingFilterForAllPartners', 'none'],
      ['setAdditionalData', 'none'],
      ['getAppsFlyerUID', 'promise'],
      ['anonymizeUser', 'none'],
      ['stop', 'promise'],
      ['disableSKAdNetwork', 'none'],
      ['disableAdvertisingIdentifier', 'none'],
      ['disableCollectASA', 'none'],
      ['setHost', 'none'],
      ['generateInviteLink', 'promise'],
      ['validateAndLogInAppPurchaseAndroid', 'promise'],
      ['disableAppSetId', 'none'],
      ['validateAndLogInAppPurchaseIos', 'promise'],
      ['getSdkVersion', 'promise'],
      ['enableFacebookDeferredApplinks', 'promise'],
      ['sendPushNotificationData', 'none'],
      ['setCurrentDeviceLanguage', 'promise'],
      ['logCrossPromoteImpression', 'promise'],
      ['setUserEmails', 'promise'],
      ['logLocation', 'promise'],
      ['setPhoneNumber', 'promise'],
      ['setPartnerData', 'promise'],
      ['logInvite', 'promise'],
      ['setSharingFilterForPartners', 'promise'],
      ['enableTCFDataCollection', 'none'],
      ['setConsentData', 'none'],
      ['startSDK', 'promise'],
      ['logAdRevenue', 'none'],
      ['setConsentDataV2', 'none'],
      ['isSDKStarted', 'promise'],
      ['isSDKStopped', 'promise'],
      ['validateAndLogInAppPurchaseV2', 'promise'],
    ],
    dependencies: [
      '        .package(url: "https://github.com/AppsFlyerSDK/AppsFlyerFramework-Static.git", from: "6.17.9")',
      '        .package(url: "https://github.com/facebook/facebook-ios-sdk.git", .upToNextMajor(from: "18.0.3"))',
    ],
    products: [
      '                .product(name: "AppsFlyerLib-Static", package: "AppsFlyerFramework-Static")',
      '                .product(name: "FacebookCore", package: "facebook-ios-sdk")',
    ],
  },
];

function packageSwiftFor(config) {
  const packageDependencies = [
    '        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")',
    ...config.dependencies,
  ];
  const targetDependencies = [
    '                .product(name: "Capacitor", package: "capacitor-swift-pm")',
    '                .product(name: "Cordova", package: "capacitor-swift-pm")',
    ...(config.products || []),
  ];

  return `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "${config.productName}",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "${config.productName}",
            targets: ["${config.targetName}"])
    ],
    dependencies: [
${packageDependencies.join(',\n')}
    ],
    targets: [
        .target(
            name: "${config.targetName}",
            dependencies: [
${targetDependencies.join(',\n')}
            ],
            path: "${config.spmPath}")
    ]
)
`;
}

function pluginReturnType(type) {
  if (type === 'none') return 'CAPPluginReturnNone';
  if (type === 'callback') return 'CAPPluginReturnCallback';
  return 'CAPPluginReturnPromise';
}

function bridgedMetadata(config) {
  const methods = config.methods
    .map(
      ([name, type]) =>
        `        CAPPluginMethod(name: "${name}", returnType: ${pluginReturnType(
          type
        )})`
    )
    .join(',\n');

  return `    public let identifier = "${config.className}"
    public let jsName = "${config.jsName}"
    public let pluginMethods: [CAPPluginMethod] = [
${methods}
    ]

`;
}

function patchPluginClass(source, config) {
  if (
    config.packageName === 'appsflyer-capacitor-plugin' &&
    !source.includes('import FBSDKCoreKit')
  ) {
    source = source.replace(
      'import AppsFlyerLib\n',
      'import AppsFlyerLib\n#if canImport(FBSDKCoreKit)\nimport FBSDKCoreKit\n#endif\n'
    );
    source = source.replace(
      '#if canImport(FacebookCore)',
      '#if canImport(FBSDKCoreKit)'
    );
    source = source.replace('FBSDKAppLinkUtility.self', 'AppLinkUtility.self');
  }

  const classPrefix = `public class ${config.className}: `;
  const classIndex = source.indexOf(classPrefix);
  if (classIndex === -1 || source.includes('CAPBridgedPlugin')) {
    return source;
  }

  const inheritanceStart = classIndex + classPrefix.length;
  const braceIndex = source.indexOf('{', inheritanceStart);
  const inheritance = source.slice(inheritanceStart, braceIndex).trim();
  const updatedInheritance = inheritance
    .split(',')
    .map(item => item.trim())
    .includes('CAPBridgedPlugin')
    ? inheritance
    : inheritance.replace('CAPPlugin', 'CAPPlugin, CAPBridgedPlugin');

  return `${source.slice(
    0,
    inheritanceStart
  )}${updatedInheritance} ${source.slice(braceIndex, braceIndex + 1)}
${bridgedMetadata(config)}${source.slice(braceIndex + 1)}`;
}

function copySwiftSources(config, packageDir) {
  const sourceDir = path.join(packageDir, config.sourcePath);
  const spmDir = path.join(packageDir, config.spmPath);

  fs.rmSync(spmDir, { recursive: true, force: true });
  fs.mkdirSync(spmDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.swift')) {
      continue;
    }

    const sourceFile = path.join(sourceDir, entry.name);
    const destinationFile = path.join(spmDir, entry.name);
    let source = fs.readFileSync(sourceFile, 'utf8');
    if (entry.name === `${config.className}.swift`) {
      source = patchPluginClass(source, config);
    }
    fs.writeFileSync(destinationFile, source);
  }
}

for (const config of packages) {
  const packageDir = path.join(root, 'node_modules', config.packageName);
  if (!fs.existsSync(packageDir)) {
    continue;
  }

  copySwiftSources(config, packageDir);

  const packageSwift = path.join(packageDir, 'Package.swift');
  fs.writeFileSync(packageSwift, packageSwiftFor(config));
  console.log(`Ensured iOS Swift Package manifest for ${config.packageName}`);
}
