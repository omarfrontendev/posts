import React from 'react';
import SinglePost from '../SinglePost';
import { motion, AnimatePresence } from 'framer-motion';

import './.scss';

export default function Posts({ posts, loading }) {

  // Lazy Load:=
  if(loading) {
    return (
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  };


  // empty :=
  if(!posts?.length) {
    return <p className='no__posts'>No Posts Found!</p>
  };

  return (
    <motion.div layout className='posts__container d-flex flex-column'>
      <AnimatePresence>
        {posts.map(post => 
          <SinglePost 
          key={post.id} 
          id={post.id} 
          post={post.post}
          createAt={post.createAt} 
          imageUrl={post.imageUrl} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
