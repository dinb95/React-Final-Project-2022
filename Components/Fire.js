// import firebase from 'firebase'; 

// class Fire {
    
//     constructor() {
//       this.init();
//       this.observeAuth();
//     }

//     init = () =>
//     firebase.initializeApp({
//       apiKey: 'AIzaSyDvDTL7yUQocA1JXW90LtKibG_uRm9z-E4',
//       authDomain: 'final-project-din-and-hadar.firebaseapp.com',
//       databaseURL: 'https://final-project-din-and-hadar-default-rtdb.europe-west1.firebasedatabase.app',
//       projectId: 'final-project-din-and-hadar',
//       storageBucket: '',
//       messagingSenderId: '490950571924',
//     });

//     observeAuth = () =>
//     firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

//     onAuthStateChanged = user => {
//         if (!user) {
//           try {
//             firebase.auth().signInAnonymously();
//           } catch ({ message }) {
//             alert(message);
//           }
//         }
//       };

//       get ref() {
//         return firebase.database().ref('messages');
//       }
//       on = callback =>
//         this.ref
//       .limitToLast(20)
//       .on('child_added', snapshot => callback(this.parse(snapshot)));

//       parse = snapshot => {
//         const { timestamp: numberStamp, text, user } = snapshot.val();
//         const { key: _id } = snapshot;
//         const timestamp = new Date(numberStamp);
//         const message = {
//             _id,
//             timestamp,
//             text,
//             user,
//           };
//          return message;
//         };

//         off() {
//             this.ref.off();
//         }

//       get uid() {
//         return (firebase.auth().currentUser || {}).uid;
//       }
     
//       get timestamp() {
//         return firebase.database.ServerValue.TIMESTAMP;
//       }
      
     
//       send = messages => {
//         for (let i = 0; i < messages.length; i++) {
//           const { text, user } = messages[i];
          
//           const message = {
//             text,
//             user,
//             timestamp: this.timestamp,
//           };
//           this.append(message);
//         }
//       };
      
//       append = message => this.ref.push(message);
   

// }
// Fire.shared = new Fire();
// export default Fire;
