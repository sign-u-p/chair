// src/components/AppTile.js
import React, { useState, useEffect, useRef } from 'react';

const AppTile = ({ app, onClick }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // Format Datum
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Überwachen des Ladevorgangs des iFrames
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      setError('Vorschau konnte nicht geladen werden');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`${app.title} öffnen`}
    >
      <div className="h-44 bg-gray-50 border-b relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 p-4 text-center">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-2">{error}</p>
            </div>
          </div>
        )}

        <iframe 
          ref={iframeRef}
          srcDoc={`
            <!DOCTYPE html>
            <html lang="de">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  margin: 0; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                  overflow: hidden; 
                  transform: scale(0.85);
                  transform-origin: 0 0;
                  width: 117.5%;
                  height: 117.5%;
                }
                #app { padding: 8px; }
              </style>
            </head>
            <body>
              <div id="app"></div>
              <script>
                try {
                  ${app.code}
                } catch (error) {
                  document.getElementById('app').innerHTML = 
                    '<div style="color: #e53e3e; padding: 10px;">Fehler: ' + error.message + '</div>';
                }
              </script>
            </body>
            </html>
          `}
          title={`Vorschau von ${app.title}`}
          className="w-full h-full border-none bg-transparent"
          sandbox="allow-scripts"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 truncate" title={app.title}>
          {app.title}
        </h3>
        
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span title={`Erstellt von ${app.author}`}>{app.author}</span>
          <span title={`Erstellt am ${formatDate(app.createdAt)}`}>
            {formatDate(app.createdAt)}
          </span>
        </div>
        
        {app.tags && app.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {app.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {app.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{app.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppTile;