// Card.js

'use client'
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { FaInstagram, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/Constants';
import { toast } from 'react-toastify';
import { User } from '@/lib/types';
import Spinner from '@/app/components/Spinner';

function Card({ username }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [about, setAbout] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/user/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData: User = await response.json();
        setUser(userData);
        setLoading(false);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setAbout(userData.about);
        setFacebook(userData.facebook);
        setTwitter(userData.twitter);
        setInstagram(userData.instagram);
        setLinkedIn(userData.linkedIn);
        setImage(`http://localhost:3333/user/profile/${username}`);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('about', about);
    formData.append('facebook', facebook);
    formData.append('twitter', twitter);
    formData.append('instagram', instagram);
    formData.append('linkedIn', linkedIn);

    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/${username}`, {
        method: 'PUT',
        body: formData
      });

      if (res.ok) {
        toast.success("Information updated successfully");
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error("Something went wrong");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      setImage(imageUrl);
    } else {
      console.warn("No image selected");
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    } else {
      console.warn("No cover image selected");
    }
  };

  return (
    <div className='w-full max-w-6xl m-1 rounded-2xl flex flex-col justify-start items-center border border-gray-300 bg-white shadow-lg'>
      {loading ? (
        <div className="text-black text-4xl flex justify-center items-center h-full">
          <Spinner/>
        </div>
      ) : (
        <div className="w-full">
          <div className='relative'>
            <div className='w-full h-64 bg-gray-200'>
              {coverImage ? (
                <Image src={coverImage} layout="fill" objectFit="cover" alt='Cover Image' />
              ) : (
                <div>No cover image available</div>
              )}
            </div>
            {editing && (
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="absolute top-2 right-2 bg-white p-1 rounded" />
            )}
            <div className='absolute left-1/2 transform -translate-x-1/2 -bottom-16'>
              {image ? (
                <Image src={image} width="120" height="120" className='rounded-full border-4 border-white' alt='Profile Image' />
              ) : (
                <div className='w-30 h-30 rounded-full bg-gray-400 flex items-center justify-center text-white'>No image</div>
              )}
              {editing && (
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute top-2 left-2 bg-white p-1 rounded" />
              )}
            </div>
          </div>
          <div className='mt-20 px-6'>
            {!editing ? (
              <div>
                <h1 className='text-neutral-700 font-bold text-3xl text-center'>{lastName} {firstName}</h1>
                <p className='font-normal uppercase text-base text-neutral-700 text-center pb-4'>{session?.user.email}</p>
                <h3 className='font-semibold text-md uppercase text-center py-2'>About</h3>
                <p className='text-sm text-neutral-600 text-center mx-10'>{about}</p>
                <div className='flex justify-center items-center gap-6 py-6'>
                  {facebook && (
                    <a href={`https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer">
                      <FaFacebookSquare className='w-6 h-6 text-blue-600 cursor-pointer' />
                    </a>
                  )}
                  {twitter && (
                    <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer">
                      <BsTwitter className='w-6 h-6 text-blue-400 cursor-pointer' />
                    </a>
                  )}
                  {instagram && (
                    <a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className='w-6 h-6 text-pink-400 cursor-pointer' />
                    </a>
                  )}
                  {linkedIn && (
                    <a href={`https://www.linkedin.com/in/${linkedIn}`} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className='w-6 h-6 text-blue-700 cursor-pointer' />
                    </a>
                  )}
                </div>
                {session?.user.id === user?.id &&
                  <div className='flex justify-center items-center gap-6 py-6'>
                    <button onClick={handleEditClick} className='text-white uppercase bg-gradient-to-r hover:bg-gradient-to-l from-cyan-500 to-blue-500 p-3 font-semibold rounded-lg w-full'>Edit Profile</button>
                  </div>
                }
              </div>
            ) : (
              <form onSubmit={handleSaveClick} className="flex flex-col items-center w-full">
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Facebook Link" className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter Link" className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram Link" className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <div className='flex flex-col justify-start items-center w-full mb-4'>
                  <input type="text" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="LinkedIn Link" className='w-full p-2 rounded-lg border border-gray-300 text-black' />
                </div>
                <button type="submit" className='text-white uppercase bg-gradient-to-r hover:bg-gradient-to-l from-cyan-500 to-blue-500 p-3 font-semibold rounded-lg w-full'>Save</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
