# milestone
*This repo does not have the `aws-exports.js` file, which may be needed to run the application. Creating a `/src` folder in the client with a file named `aws-exports.js` should solve the issue (currently looking to resolve the issue).

Actual pages and components should be in the **client** folder, which contains `App.js` as the top-level component. Everything that's actually visible on the app itself *should* be in the **components** folder, along with some sub-components. There should also be a contexts folder, which provides the user's information as well as details about the current device's connection. This data can be accessed through importing the `userContext.js` file.

This project was started using Expo's Bare Workflow.

Currently, the project has integrations with a couple AWS services, including S3, EC2, and RDS. As a result, the `server.js` file in this repo is unused as the actual file is running on an EC2 instance. Additionally, Cloudfront is being used for distribution, however the app still renders assets much slower without access to a proper wifi connection. Finally, Amplify is used to connect these services to our app, as well as authenticating users through AWS' `{Auth}` module and Cognito.

The production build for the app is available on Testflight for external testing, and the build was put together by EAS for context. The development client has a few features that can't be used with the Expo client, namely the `FastImage` component.
