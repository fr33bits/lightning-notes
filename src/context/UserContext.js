import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

const UserContext = createContext(null); // ! I added null myself (didn't complain about not having a default value to initialize it)

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userID, setUserID] = useState(cookies.get("user_id")); // besides providing the ID, this also indicates whether or not a user has been signed in by the relevant application logic
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // IMPLEMENTATION 1: onAuthStateChanged
    // useEffect(() => {
    //     // Listen for authentication state changes
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         if (currentUser) {
    //             setUser(currentUser)
    //         } else {
    //             setUser(null)
    //         }
    //         setLoading(false);
    //         console.log("FINISHED LOADING!, ", currentUser)
    //     });

    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();
    // }, []);

    // IMPLEMENTATION 2: users stream; this is what is actually used since the users stream holds the relevant data
    useEffect(() => {
        if (!userID) {
            // console.log("CONTEXT: User ID not set")
            setLoading(false)
            setUser(null)
            return // the user is not set
        } // TODO: else?

        // console.log("CONTEXT: User ID set")
        const userRef = doc(db, 'users', userID)
        const unsubscribe = onSnapshot(userRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setUser({id: snapshot.id, ...snapshot.data()})
                } else {
                    setUser(null)
                }
                setLoading(false)
            },
            (error) => {
                console.error("Error getting user: ", error)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [userID])

    return (
        <UserContext.Provider value={{ user, setUser, setUserID, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);