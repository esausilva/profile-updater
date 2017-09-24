/**
 * Gets user credentials by user id.
 * @param {object} db - firebase database object
 * @param {string} userId - firebase user id
 */
export const readUserFromFirebase = async (db, userId) => {
  const snapshot = await db.ref(`/user/${userId}`).once('value');

  return snapshot.val() || {};
};

/**
 * Updates user object in firebase.
 * @param {object} db - firebase database object
 * @param {object} user - user object
 */
export const updateUserToFirebase = (db, user) => {
  const updates = {};
  updates[`/user/${user.userId}`] = user.data;

  return db.ref().update(updates);
};
