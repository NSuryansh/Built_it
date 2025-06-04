import React from 'react';

function VideoSection({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {videos.map((videoUrl, index) => (
        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-pink-300 shadow-lg hover:border-pink-400 transition-all">
          <iframe
            src={videoUrl}
            title={`Video ${index + 1}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}

export default VideoSection;
