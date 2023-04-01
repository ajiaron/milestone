# milestone - native
This repo has the whole bundle, I didn't really try reducing the size at all (apologies)!
There are a lot of files that should be ignored, but most of them are config files that you still might need for npm start/expo start to work.

Actual pages and components should be in the **client** folder, which contains `App.js` as the top-level component. Everything that's actually visible on the app itself *should* be in the **components** folder, along with some sub-components. There should also be a contexts folder, which provides the user's information as well as details about the current device's connection. This data can be accessed through importing the `userContext.js` file.

This project was started using **Expo CLI** (`npx create-expo-app`) as opposed to React Native CLI.

Currently, the project has integrations with a couple AWS services, including S3, EC2, and RDS. As a result, the `server.js` file in this repo is unused as the actual file is running on an EC2 instance. Additionally, Cloudfront is being used for distribution, however the app still renders assets much slower without access to a proper wifi connection. Finally, Amplify is used to connect these services to our app, and I plan to use Amplify to handle authentication with Cognito in a future release.
TEST TEST
The production build for the app is available on Testflight for external testing, and the build was put together by EAS for context. The development client has a few features that can't be used with the Expo client, such as `react-image-colors`, although I am currently working on making both versions identical. 
