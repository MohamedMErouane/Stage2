"use client"
import { BACKEND_URL } from '@/lib/Constants';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { FaPause, FaPlay, FaSyncAlt } from 'react-icons/fa';

const TimerApp = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [actualite, setActualite] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is admin
  const { data: session } = useSession();

  useEffect(() => {
    // Check if the user is admin
    if (session && session.user && session.user.isAdmin) {
      setIsAdmin(true);
    }

    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds === 59) {
          setMinutes(minutes + 1);
          setSeconds(0);
        } else {
          setSeconds(seconds + 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, minutes, seconds, session]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    await createStudyTime(minutes + seconds / 60); 
  };

  const resetTimer = async () => {
    setIsRunning(false);
    await createStudyTime(minutes + seconds / 60); 
    setMinutes(0);
    setSeconds(0);
  };

  const createStudyTime = async (hours: number) => {
    console.log("im in create study time func in front ")
    try {
      const response = await fetch(BACKEND_URL + '/pomodoro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: session?.user.id, 
          hours 
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save time to database');
      }
    } catch (error) {
      console.error('Error creating study time:', error);
    }
  };

  const handleAddActualite = async () => {
    try {
      // Implement adding actualité here
      console.log("Add actualité:", actualite);
    } catch (error) {
      console.error('Error adding actualité:', error);
    }
  };

  return (
    <div className='flex h-screen bg-white'>
      <div className="container mx-auto p-2 bg-transparent rounded-md shadow-md text-white font-bold text-sm mt-2">
        <p className="text-center text-black">
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
        {isAdmin && (
          <div>
            <input
              type="text"
              value={actualite}
              onChange={(e) => setActualite(e.target.value)}
              placeholder="Add Actualité"
            />
            <button onClick={handleAddActualite}>Add</button>
          </div>
        )}
        {isRunning ? (
          <button onClick={pauseTimer} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md">
            <FaPause />
          </button>
        ) : (
          <button onClick={startTimer} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md">
            <FaPlay />
          </button>
        )}
        <button onClick={resetTimer} className="mt-2 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md ml-1">
          <FaSyncAlt />
        </button>
      </div>
      {/* Display example actualités */}
      <div className="mt-4 ml-2">
        <h2 className="text-xl font-semibold">Example Actualités:</h2>
        <div className="flex justify-center mt-2">
          <img src="/actualites/actualite1.jpg" alt="Actualité 1" className="w-32 h-32 object-cover rounded-md mr-2" />
          <img src="/actualites/actualite2.jpg" alt="Actualité 2" className="w-32 h-32 object-cover rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default TimerApp;
