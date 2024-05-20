import React, { useState } from 'react';
import avatar from '../images/addavatar.png';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();




        const email = e.target[0].value;
        const password = e.target[1].value;
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
            setLoading(false);

        }
        catch (error) {
            console.error('User creation error:', error);
            setErr(true);
            setLoading(false);
        }
    };
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Viatu Chat</span>
                <span className="title">Create Account</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='enter email' />
                    <input type="password" placeholder='enter password' />

                    {loading ? (
                        <button>Signing in....</button>
                    ) : (
                        <button>Sign In</button>

                    )}
                    {err && <span>Something went wrong</span>}
                </form>

                <Link to="/register">
                    <p>Dont have an account? Register</p>
                </Link>
            </div>
        </div>
    );
}

export default Login;
