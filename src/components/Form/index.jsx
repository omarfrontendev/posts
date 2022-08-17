import React, { useState } from 'react'
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { FcAddImage } from 'react-icons/fc'

import './form.scss'

export default function Form({ setLoading }) {
  
  const [data, setData] =useState({
    post: '',
    imageUrl: '',
    createAt: Timestamp.now().toDate()
  });
  const [progress, setProgress] = useState(0);
  const [loadingBtn, setLoadingBtn] = useState(false)

  let formValidate = false
  if(data.post) {
    formValidate = true
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setLoadingBtn(true);
    const storageRef = ref(storage, `/images/${Date.now()}${data.imageUrl.name}`)
    const uploadImage = uploadBytesResumable(storageRef, data.imageUrl);
    uploadImage.on("state_changed",snapshot => {
        const progressPrecent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progressPrecent);
      }, err => {
        console.log(err);
      }, () => {
        setData({
          post: '',
          imageUrl: '',
        });
        getDownloadURL(uploadImage.snapshot.ref)
        .then(url => {
          const postCollectionRef = collection(db, "posts");
          addDoc(postCollectionRef, {
            post: data.post,
            imageUrl: data.imageUrl ? url : '',
            createAt: Timestamp.now().toDate()
          }).then(() => {
            toast('success', {type: 'success'});
            setProgress(0);
            // setLoading(false);
            setLoadingBtn(false)
          }).catch(err => {
            toast('faild', {type: 'error'});
          })
        })
      })
  };

  return (
    <form onSubmit={submitFormHandler} className='form__container position-relative'>
      <input 
        type='text' 
        name='post' 
        placeholder='type your post here...'
        value={data.post}
        onChange={e => setData({...data, post: e.target.value})}
        className='post__input'
      />
      <input 
        type="file" 
        name='image'
        accept='image/*'
        onChange={e => setData({...data, imageUrl: e.target.files[0]})}
        id='image__input'
        className='d-none image__input'
      />
      <div className='form__bottom d-flex align-items-center justify-content-end'>
        <label className='label' htmlFor="image__input">
          <FcAddImage />
        </label>
        <button disabled={!formValidate || loadingBtn} className='submit__btn' type='submit'>{loadingBtn ? 'Loading...' : 'Post'}</button> 
      </div>
      <div className='progress mt-2 mb-2'>
        <div className='progress-bar progress-bar-striped' style={{width: `${progress}%`}}>
          {progress}%
        </div>
      </div>
    </form>
  )
}
