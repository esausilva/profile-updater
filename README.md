# profile updater

> Updates social profiles: GitHub, Twitter and Facebook

The purpose is to type your profile information once, and then send the updates to your profile in Twitter, GitHub & Facebook.

This project is still in development and not ready for production usage, however it is up to a point where I feel comfortable to make it public. As of right now, you can already send updates to Twitter and GitHub.

Also, once the project is complete, I will create a series of blog posts tutorials on building this app, including Webpack configuration for development and production.

## Technologies/OSS Projects Used

 - React
 - React Router
 - Webpack
 - Firebase for authentication and database
 - React Semantic UI
 - Node/Express
 - & tons of other NPM packages

## Setting up the app

### Clone this repo

```
git clone https://github.com/esausilva/profile-updater.git
``` 

### Install server and client dependencies

```
yarn && cd client && yarn
```

### Environment variables (1)

Rename `.env.example` to `.env` in **server** and **client**

### Firebase

 1. Create an app. [https://console.firebase.google.com/](https://console.firebase.google.com/)
 2. Select **Database** > **Rules** and change the default to this:
```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Twitter

 1. Create an app and take note of the *Consumer* and *Secret* keys. [https://apps.twitter.com/](https://apps.twitter.com/)
 2. Go back to *Firebase* **Authentication** > **Sign-In Method**; select *Twitter* and switch to *Enable*, then paste the *Consumer* and *Secret* keys from Twitter; finally copy the *callback URL*
 3. Back in Twitter paste the *callback URL* where required
 4. Change the access levels to *Read and Write*

### GitHub

 1. Register a new app and take note of the *Client ID* and *Secret*. [https://github.com/settings/developers](https://github.com/settings/developers)
 2. *Go thru the same dance as with Firebase authentication with Twitter*
 3. Back in GitHub paste the *callback URL* where required

### Facebook

 1. Add a new app and take note of the *App ID* and *Secret*. [https://developers.facebook.com/](https://developers.facebook.com/)
 2. *Go thru the same dance as with Firebase authentication with Twitter*
 3. Back in Facebook paste the *callback URL* where required (Under **Products** > **Facebook Login** > **Settings**)

### Environment variables (2)

Go back to the `.env` files and paste the required keys. For the **CRYPTOJS_KEY** just create a random alphanumeric string, the longer the better.

### Running the app

```
yarn dev
```

Will launch Node and React apps concurrently.

To run with [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

```
yarn dev:bundleanalyzer
```

## Roadmap

In no particular order.

 - ~~Better "Page Not Found"~~
 - ~~Current connected providers and profile information in side menu~~
 - ~~Code splitting~~
 - ~~Update to React 16 and Webpack 3~~
 - Better error handling throughout the app
 - ~~Unlink an auth provider from an user account~~
 - *I know there are others, but I forget right now* 🙁
 - Send updates to Facebook profile (will implement last)

## Preview

![GIF](https://i.imgur.com/Kr5TgjB.gif)

![GIF](https://i.imgur.com/sVqiw0m.gif)

![GIF](https://i.imgur.com/usdI3k5.gif)
