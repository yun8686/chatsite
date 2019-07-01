import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    "apiKey": "AIzaSyCf2vrVfmhMJpyJH50SXKMtWaY7LacOKIk",
    "authDomain": "freeroom-53002.firebaseapp.com",
    "databaseURL": "https://freeroom-53002.firebaseio.com",
    "projectId": "freeroom-53002"
  });
  const db = firebase.firestore()
}
export default firebase
