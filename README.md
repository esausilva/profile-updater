# profile updater

> Real world example app. Updates social profiles: GitHub, Twitter and Facebook

The purpose is to type your profile information once, and then send the updates to your profile in Twitter, GitHub & Facebook.

## Technologies/OSS Projects Used

* React
* React Router
* Webpack
* Firebase for authentication and database
* React Semantic UI
* Node/Express
* & tons of other NPM packages

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

Run the following script to create the necessary `.env` files for the client and server. This will copy the contents of `.env.example` into the respective `.env` files.

```
yarn setup
```

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

1. Create an app and take note of the _Consumer_ and _Secret_ keys. [https://apps.twitter.com/](https://apps.twitter.com/)
2. Go back to _Firebase_ **Authentication** > **Sign-In Method**; select _Twitter_ and switch to _Enable_, then paste the _Consumer_ and _Secret_ keys from Twitter; finally copy the _callback URL_
3. Back in Twitter paste the _callback URL_ where required
4. Change the access levels to _Read and Write_

### GitHub

1. Register a new app and take note of the _Client ID_ and _Secret_. [https://github.com/settings/developers](https://github.com/settings/developers)
2. _Go thru the same dance as with Firebase authentication with Twitter_
3. Back in GitHub paste the _callback URL_ where required

### Facebook

1. Add a new app and take note of the _App ID_ and _Secret_. [https://developers.facebook.com/](https://developers.facebook.com/)
2. _Go thru the same dance as with Firebase authentication with Twitter_
3. Back in Facebook paste the _callback URL_ where required (Under **Products** > **Facebook Login** > **Settings**)

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

## Giving Back

If you would like to support my work and the time I put into making tutorials, consider getting me a coffee by clicking on the image below. I would really appreciate it!

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/esausilva)

## Preview

![GIF](https://i.imgur.com/Kr5TgjB.gif)

![GIF](https://i.imgur.com/sVqiw0m.gif)

![GIF](https://i.imgur.com/usdI3k5.gif)
