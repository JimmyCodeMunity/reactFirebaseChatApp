import React, { useContext, useState } from 'react';
import image from '../images/addavatar.png'
import attach from '../images/attach.png'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';



const Input = () => {
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext);

  const [text, setText] = useState("")
  const [img, setImg] = useState(null)
  // console.log("id chat:",data.chatId)


  // const handleSend = async () => {
  //   console.log("chat id:",data.chatId)
  //   if (img) {
  //     const storageRef = ref(storage, uuid);
  //     const uploadTask = uploadBytesResumable(storageRef, img);
  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         // Progress tracking if needed
  //       },
  //       (error) => {
  //         // Handle unsuccessful uploads
  //         console.error('Upload error:', error);
  //         setErr(true);
  //       },
  //       async () => {
  //         // Handle successful uploads on complete
  //         try {
  //           // Get the download URL of the uploaded file
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

  //           // Update the user's profile with display name and photo URL
  //           await updateDoc(doc(db, "chats", data.chatId), {

  //             messages: arrayUnion({
  //               id: uuid(),
  //               text,
  //               senderId: currentUser.uid,
  //               date: Timestamp.now(),
  //               img:downloadURL
  //             })
  //           })
  //         } catch (error) {
  //           console.error('Error updating profile or setting document:', error);
  //           setErr(true);
  //         }
  //       }
  //     );

  //   } else {
  //     await updateDoc(doc(db, "chats", data.chatId), {

  //       messages: arrayUnion({
  //         id: uuid(),
  //         text,
  //         senderId: currentUser.uid,
  //         date: Timestamp.now()
  //       })
  //     })
      

  //   }


  //   await updateDoc(doc(db,"userChats",currentUser.uid),{
  //     [data.chatId+".lastMessage"]:{
  //       text
  //     },
  //     [data.chatId+".date"]:serverTimestamp()
  //   })
  //   await updateDoc(doc(db,"userChats",data.user.uid),{
  //     [data.chatId+".lastMessage"]:{
  //       text
  //     },
  //     [data.chatId+".date"]:serverTimestamp()
  //   })
  //   setText("")
  //     setImg(null)

  // }
  // const handleSend = async () => {
  //   console.log("chat id:",data.chatId)
  //   if (img) {
  //     const storageRef = ref(storage, uuid);
  //     const uploadTask = uploadBytesResumable(storageRef, img);
  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         // Progress tracking if needed
  //       },
  //       (error) => {
  //         // Handle unsuccessful uploads
  //         console.error('Upload error:', error);
  //         setErr(true);
  //       },
  //       async () => {
  //         // Handle successful uploads on complete
  //         try {
  //           // Get the download URL of the uploaded file
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
  //           // Update the user's profile with display name and photo URL
  //           await updateDoc(doc(db, "chats", data.chatId), {
  //             messages: arrayUnion({
  //               id: uuid(),
  //               text,
  //               senderId: currentUser.uid,
  //               date: Timestamp.now(),
  //               img: downloadURL
  //             })
  //           });
  
  //           // Update user chats with last message and date
  //           await updateDoc(doc(db,"userChats",currentUser.uid),{
  //             [data.chatId+".lastMessage"]: { text },
  //             [data.chatId+".date"]: serverTimestamp()
  //           });
  //           await updateDoc(doc(db,"userChats",data.user.uid),{
  //             [data.chatId+".lastMessage"]: { text },
  //             [data.chatId+".date"]: serverTimestamp()
  //           });
  
  //           // Clear text and image states after sending
  //           setText("");
  //           setImg(null);
  //         } catch (error) {
  //           console.error('Error updating profile or setting document:', error);
  //           setErr(true);
  //         }
  //       }
  //     );
  //   } else {
  //     // If no image attached, send message without image
  //     await updateDoc(doc(db, "chats", data.chatId), {
  //       messages: arrayUnion({
  //         id: uuid(),
  //         text,
  //         senderId: currentUser.uid,
  //         date: Timestamp.now()
  //       })
  //     });
  
  //     // Update user chats with last message and date
  //     await updateDoc(doc(db,"userChats",currentUser.uid),{
  //       [data.chatId+".lastMessage"]: { text },
  //       [data.chatId+".date"]: serverTimestamp()
  //     });
  //     await updateDoc(doc(db,"userChats",data.user.uid),{
  //       [data.chatId+".lastMessage"]: { text },
  //       [data.chatId+".date"]: serverTimestamp()
  //     });
  
  //     // Clear text state after sending
  //     setText("");
  //   }
  // };
  const handleSend = async () => {
    console.log("chat id:", data.chatId);
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking if needed
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload error:', error);
          setErr(true);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            // Update the chat with the message including the image URL
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: '',
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              })
            });
  
            // Update user chats with last message and date
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [`${data.chatId}.lastMessage`]: { text: '' },
              [`${data.chatId}.date`]: serverTimestamp()
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
              [`${data.chatId}.lastMessage`]: { text: '' },
              [`${data.chatId}.date`]: serverTimestamp()
            });
  
            // Clear text and image states after sending
            setText("");
            setImg(null);
          } catch (error) {
            console.error('Error updating profile or setting document:', error);
            setErr(true);
          }
        }
      );
    } else {
      // If no image attached, send message without image
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      });
  
      // Update user chats with last message and date
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: { text },
        [`${data.chatId}.date`]: serverTimestamp()
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: { text },
        [`${data.chatId}.date`]: serverTimestamp()
      });
  
      // Clear text state after sending
      setText("");
    }
  };
  
  
  return (
    <div className="input">
      <input type="text"
      value={text}
      placeholder='type something' onChange={e => setText(e.target.value)} />
      <div className="send">
        <img src={attach} alt="" />
        <input type="file"

        style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
        <img src={image} alt="" />
        </label>
        
        <button onClick={handleSend}>send</button>
      </div>

    </div>
  );
}

export default Input;
