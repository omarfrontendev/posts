import React, { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { doc, updateDoc } from 'firebase/firestore'

import './.scss'
import { db, storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';

export default function EditPost({ post, imageUrl, setPoup, id }) {

  const [data, setData] = useState({
    updatePost: post,
    updateImageUrl: ''
  });
  const [editImage, setEditImage] = useState(imageUrl);
  const [loading, setLoading] = useState(false)

  const updateImageHandler = (e) => {
    setData({...data, updateImageUrl: e.target.files[0]})
    let files = e.target.files;
    let reader = new FileReader();
    reader.onload = e => {
      setEditImage(e.target.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const editHandler = () => {
    setLoading(true)
    const storageRef = ref(storage, `/images/${Date.now()}${data.updateImageUrl.name}`)
    const uploadImage = uploadBytesResumable(storageRef, data.updateImageUrl);
    uploadImage.on("state_changed",
      snapshot => {},
      err => {
        console.log(err);
      }, () => {
        setData({
          updatePost: '',
          updateImageUrl: ''
        });
        getDownloadURL(uploadImage.snapshot.ref)
        .then(url => {
          const docRef = doc(db, 'posts', id) 
          updateDoc(docRef, {
            post: data.updatePost,
            imageUrl: data.updateImageUrl ? url : imageUrl,
          }).then(() => {
            toast('success', {type: 'success'});
            setLoading(false);
            setPoup(false);
          }).catch(err => {
            toast('faild', {type: 'error'});
          })
        })
      }
    )
  }

  return (
    <div className='popup'>
      <div className='popup__container'>
        <input className='edit__post__input' type="text" placeholder='type your post' value={data.updatePost} onChange={e => setData({...data, updatePost: e.target.value})} />
        <input 
          type="file" 
          name='image'
          accept='image/*'
          onChange={e => updateImageHandler(e)} 
          className='d-none'
          id='edit__image__input'
        /> 
        <label htmlFor="edit__image__input">
          <img className='d-block image-fluid mx-auto img__edit' src={editImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s'} alt="" />
        </label>
        <button 
          onClick={editHandler} 
          className='save__btn'
          disabled={loading}
        >
          {loading ? 'Saving...!' : 'Save'}
        </button>
        <button onClick={() => setPoup(false)} className='close__btn position-absolute'><AiFillCloseCircle /></button>
      </div>
    </div>
  )
}
