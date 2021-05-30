# #13.0 Introduction (02:23)

## React native facebook, skype..

# #13.1 Why Expo is Awesome (12:45)

## Don't do CLI manually, jus use expo

## When use

1. can build android/ios from windows, mac linux
2. support expo SDK: RN is decreasing SDK
3. easy to install
4. expo go: can test with phone
5. expo snack: build on web
6. over-the-air updates: fetch new js file

# #13.2 Why Expo Sucks (08:37)

- https://docs.expo.io/introduction/why-not-expo/

1. When have to access to native files: use CLI
2. Some expo SDK doesn't exist: CLI with donwloading from npm

- eg: bluetooth is not supported on expo

3. No background player, background push
4. App can be bigger
5. Cuz of Social media auth SDK, cannot target only children under 13 years old.

# #13.3 Our Plan (09:54)

## eject: export but keep current code

### managed workflow(expo) => bare workflow(CLI)

- https://docs.expo.io/introduction/managed-vs-bare/#workflow-comparison

# #13.4 Creating Our Project (08:29)

```
npm install --global expo-cli
expo init instaclone-native
> blank (TypeScript)
cd instaclone-native
git init
git remote add origin https://github.com/devgony/instaclone-native
```

- app.json: configure integration
- splash: when we login
- npm run start: web console
