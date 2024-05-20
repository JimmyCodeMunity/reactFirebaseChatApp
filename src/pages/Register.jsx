import React, { useState } from 'react';
import avatar from '../images/addavatar.png';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';




const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0]; // Get the file from the input field

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a storage reference with a unique name (use the user's UID as the file name)
            const storageRef = ref(storage, `avatars/${user.uid}`);

            // Upload the file to Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, file);

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

                        // Update the user's profile with display name and photo URL
                        await updateProfile(user, {
                            displayName,
                            photoURL: downloadURL
                        });

                        // Create a document in Firestore to store user data
                        await setDoc(doc(db, "users", user.uid), {
                            uid: user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });


                        await setDoc(doc(db,"userChats",user.uid),{

                        })
                        // Redirect to the home page
                        navigate("/");
                    } catch (error) {
                        console.error('Error updating profile or setting document:', error);
                        setErr(true);
                    }
                }
            );
        } catch (error) {
            console.error('User creation error:', error);
            setErr(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Viatu Chat</span>
                <span className="title">Create Account</span>
                <form onSubmit={handleSubmit} action="">
                    <input type="text" placeholder='display name' />
                    <input type="email" placeholder='enter email' />
                    <input type="password" placeholder='enter password' />
                    <input type="file" style={{ display: "none" }} id='file' />
                    <label htmlFor="file">
                        <img src={avatar} alt="" />
                        <span>Add avatar</span>
                    </label>
                    <button>Sign Up</button>
                </form>
                {err && <span>Something went wrong</span>}
                <p>Dont have an account? Login</p>
            </div>
        </div>
    );
}

export default Register;
