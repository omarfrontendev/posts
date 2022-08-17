import React, { useState } from 'react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db, storage } from '../../firebaseConfig'
import { toast } from 'react-toastify'
import { deleteObject, ref } from 'firebase/storage'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'
import EditPost from '../EditPost'
import { motion } from 'framer-motion'

import './singlePost.scss';

export default function SinglePost({ id, post, imageUrl, createAt }) {

  const [popup, setPoup] = useState(false);

  const deleteHandler = async () => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      toast('Delete Success', {type: 'success'});
      if(imageUrl) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef)
      }
    } catch (error) {
      toast('faild', {type: 'error'})
    }
  };


  return (
    <>
      <motion.div 
        className='single__post'
        layout
        initial={{y: 100, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -100, opacity: 0}}
        transition={{type: 'spring', bounce: .3, stiffness: 60, duration: .3}}
      >
        <div className="post__header d-flex align-items-start justify-content-between">
          <div className="post__text">{post}</div>
          <div className="post__btns d-flex align-items-center justify-content-center">
            <button className='delete__btn' onClick={deleteHandler}><AiTwotoneDelete /></button>
            <button className='edit__btn' onClick={() => setPoup(prev => !prev)}><AiTwotoneEdit /></button>
          </div>
        </div>
        {imageUrl && (
          <div className='post__image'>
            <img className='image' src={imageUrl} alt="" />
          </div>
        )}
      </motion.div>
      {popup && <EditPost id={id} post={post} imageUrl={imageUrl} setPoup={setPoup} />}
    </>
  )
}
