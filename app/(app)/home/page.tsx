"use client"

import React, {useState, useEffect, useCallback, use} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { video } from '@/types'
import { Video } from '@prisma/client'


function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isloading, setloading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos")
      if(Array.isArray(response.data)){
        setVideos(response.data);
      }
      else {
        throw new Error("Unexpected file format")
      }
    } catch (error) {
      console.log(error);
      setError("failed to fetch messages")
    } finally {
      setloading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleDownload = useCallback((url: string, title: string) => {
    () => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [])

  if(isloading){
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Videos</h1>
      {videos.length === 0 || !videos? (
        <div className='text-center text-lg text-gray-500'>
          No videos available
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {
          videos.map((video) => (
            <VideoCard
              key = {video.id}
              video = {video}
              onDownload = {handleDownload}
            />
          ))
        }
        </div>
      )}
    </div>
  )
}

export default Home
