export const bl = (firebase, githubColor) => ({
  github: {
    color: githubColor,
    visible: true,
    provider: () => {
      const provider = new firebase.firebase_.auth.GithubAuthProvider();
      provider.addScope('user');
      return provider;
    }
  },
  twitter: {
    color: 'twitter',
    visible: true,
    provider: () => new firebase.firebase_.auth.TwitterAuthProvider()
  },
  facebook: {
    color: 'facebook',
    visible: true,
    provider: () => new firebase.firebase_.auth.FacebookAuthProvider()
  }
});
