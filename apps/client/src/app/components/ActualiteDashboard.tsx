"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/Constants';
import Pomodoro from "../components/Pomodoro"
// Interface for Actualité data
interface Actualite {
  id: number;
  title: string;
  createdAt: Date;
  fileUrl?: string; // Optional field for uploaded file URL
}

const ActualiteDashboard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [newActualiteTitle, setNewActualiteTitle] = useState(''); // State for title

  // Fetch actualités on component mount (replace with your API call)
  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    const response = await fetch(`${BACKEND_URL}/actualite/actualiteGet`); 
    const data = await response.json();
    setActualites(data);
  };

  // Function for handling file selection (optional for visible file input)
  const handleFileChange = (event: { target: HTMLInputElement; }) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImageUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleAddActualite = () => {
    if (session && session.user && session.user.isAdmin) {
     
    } else {
      alert("Only admins can add actualités.");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0 && newActualiteTitle.trim() !== '') {
      const uploadedActualites: Actualite[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('fileUrl', file);
        formData.append('title', newActualiteTitle); 

        const response = await fetch(`${BACKEND_URL}/actualite/actualite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const uploadedFileUrl = await response.json(); 
          const newActualite: Actualite = {
            id: new Date().getTime(), 
            title: newActualiteTitle, 
            createdAt: new Date(),
            fileUrl: uploadedFileUrl.fileUrl, 
          };
          uploadedActualites.push(newActualite);
        } else {
          alert(`Failed to upload file: ${file.name}`);
        }
      }

      // Update the actualités list
      setActualites((prevActualites) => [...prevActualites, ...uploadedActualites]);
      // Clear selected files, previews, and title
      setSelectedFiles([]);
      setPreviewImageUrls([]);
      setNewActualiteTitle('');
      // Refetch actualités to ensure all users see the updated list
      fetchActualites();
    } else {
      alert('Please select files and enter a title for the actualité.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Actualités Dashboard</h1>

      {session ? (
        <>
          {session.user && session.user.isAdmin ? (
            <>
              <div className="mb-6">
                <label htmlFor="newActualiteTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Actualité Title:
                </label>
                <input
                  type="text"
                  id="newActualiteTitle"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 mb-4"
                  placeholder="Enter actualité title"
                  value={newActualiteTitle}
                  onChange={(e) => setNewActualiteTitle(e.target.value)}
                />
                <input
                  type="file"
                  id="fileInput"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpload}
              >
                Add Actualité
              </button>
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="mb-4">
                      <p>Selected File: {file.name}</p>
                      {previewImageUrls[index] && (
                        <img
                          src={previewImageUrls[index]}
                          alt="Actualité Preview"
                          className="w-full h-auto max-h-48 object-cover mb-2 rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500">You do not have permission to add actualités.</p>
          )}
        </>
      ) : (
        <p>
          Please sign in to add actualités.{' '}
          <button className="text-blue-500 hover:underline" onClick={() => signIn()}>
            Sign In
          </button>
        </p>
      )}

      {actualites.length > 0 ? (
        <ul className="list-none mt-8">
          {actualites.map((actualite) => (
            <li key={actualite.id} className="mb-4 bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{actualite.title}</h3>
              {actualite.fileUrl && (
                <p className="text-blue-500 underline mb-2">
                  <a href={actualite.fileUrl} target="_blank" rel="noopener noreferrer">
                    View Actualité File
                  </a>
                </p>
              )}
              <p className="text-sm text-gray-500">{new Date(actualite.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-8">No actualités found.</p>
      )}
        
    </div>
  );
};

export default ActualiteDashboard;