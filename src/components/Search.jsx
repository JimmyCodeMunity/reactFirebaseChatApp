import React, { useContext, useState } from 'react';
import logo from '../images/addavatar.png'
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext'



const Search = () => {
  const [username, setUsername] = useState("")
  const [user, setuser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext)

  const handleSearch = async () => {
    const q = query(collection(db, "users"),
      where('displayName', "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc,id,"=>", doc.data())
        setuser(doc.data());
      })

    } catch (error) {
      console.log(error)
      setErr(true);

    }

  }

  const handleKey = e => {
    e.key === 'Enter' && handleSearch()

  }

  const handleSelect = async () => {
    // Check if group exists
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try {
      // Set chat document (will create if not exist)
      await setDoc(doc(db, "chats", combinedId), { messages: [] }, { merge: true });

      // Update userChats for current user
      await setDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId]: {
          userInfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          date: serverTimestamp()
        }
      }, { merge: true });

      // Update userChats for other user
      await setDoc(doc(db, "userChats", user.uid), {
        [combinedId]: {
          userInfo: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          date: serverTimestamp()
        }
      }, { merge: true });


      console.log("Chat document created/updated successfully");
      setuser(null)
      setUsername("");
    } catch (error) {
      console.error("Error creating/updating chat document:", error);
      setErr(error);
      setuser(null)
      setUsername("");
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder='search user'
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>Something went wrong</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  );
}

export default Search;
