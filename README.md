# milestone - native
This repo has the whole bundle, I didn't really try reducing the size at all (apologies)!
There are a lot of files that should be ignored, but most of them are config files that you still might need for npm start/expo start to work.

Actual pages and components should be in the **client** folder, which contains `App.js` as the top-level component. Everything that's actually visible on the app itself *should* be in the **components** folder, along with some sub-components.

The .client/components folder has some .css files, these are completely useless and I forgot to take em out. All the stylesheets are included inline with the .js files, but there is a folder called "styles" that we should eventually put our stylesheets in.

This project was started using **Expo CLI** (`npx create-expo-app`) as opposed to React Native CLI, so use `expo publish` in terminal to deploy an actual build of milestone to a public URL (not the same as `npm start`/`expo start`).  

So the overall process for creating a new page formatted with the rest of the app would be as follows:  

**Imports**   
```
import React from "react"  
import {Text, StyleSheet, View, Dimensions, Pressable} from "react-native"   # <View> = <div>  
import {useNavigation} from "@react-navigation/native"
import Footer from "./Footer"  
```
**Dimensions**
```
const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height
```
**Component**
```
const NewPage = () => {
   return (
      <View style={styles.newPage}>
         /* your code here */ 
      </View> 
   )
}
/* stylesheet goes here */
export default NewPage
```
**StyleSheet**  
```
const styles = Stylesheet.create({  
    newPage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll"
    }
    ...
)}
```

Once these code snippets are saved onto a page (let's call it NewPage.js), we have to include the following in our top-level component `App.js` if we want to connect our new page to the rest of the app.  

**App.js**
```
import NewPage from "./components/NewPage"

function App() {
...
  return (
    ...
    <Stack.Navigator>
    -->  <Stack.Screen name="NewPage" component={NewPage} /> 
    </Stack.Navigator>
    ...
  )
}
```
At this point, your new page is connected with the rest of milestone! The last step is to choose any component off any screen (could be a button, text, i like using the icons on the footer) and wrap a `<Pressable>` tag around it.  
For example, here is a `<pressable>` wrapped around the book icon in the footer:

**Footer.js**
```
const navigation = useNavigation()  #important

<Pressable onPress={() => navigation.navigate("NewPage")}>
  <Image
      style={styles.milebookImage}
      resizeMode="contain"
      source={require("../assets/milebook-logo.png")} 
  />
</Pressable>
```

That image (or whichever component is wrapped) is now the link to your new page. This is the general outline for how I made the other pages on the app, but feel free to follow the other pages to see how I formatted them. 
Don't sweat the small stuff, there's a lot of small stuff!
