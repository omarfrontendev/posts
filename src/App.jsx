import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Form from './components/Form'
import Posts from './components/Posts'
import { db } from './firebaseConfig';

import './globalStyle.css'

export default function App() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch data:=
  useEffect(() => {
    setLoading(true)
    const getPosts = () => {
      const postsCollectionRef = collection(db, "posts");
      const q = query(postsCollectionRef, orderBy("createAt", "desc"));

      onSnapshot(q, (snapshot) => {
        const currentPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setPosts(currentPosts);
        setLoading(false);
      })
    };

    getPosts();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container'>
      <div className="wrapper">
        <Form setLoading={setLoading} />
        <Posts posts={posts} loading={loading} />
      </div>
    </div>
  )
}

