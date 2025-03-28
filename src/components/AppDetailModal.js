// src/components/AppDetailModal.js
import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const AppDetailModal = ({ app, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [showQR, setShowQR] = useState(false);
  const appUrl = `${window.location.origin}/app/${app.id}`;
  const codeRef = useRef(null);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(app.code);
    alert('Code in die Zwischenablage kopiert!');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={app.title}
      size="xl"
    >
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`mr-2 py-2 px-4 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'preview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'preview' ? 'page' : undefined}
          >
            Vorschau
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`mr-2 py-2 px-4 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'code' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'code' ? 'page' : undefined}
          >
            Code
          </button>
          <button
            onClick={() => {
              setActiveTab('share');
              setShowQR(true);
            }}
            className={`py-2 px-4 text-sm font-medium border-b-2 focus:outline-none ${
              activeTab === 'share' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'share' ? 'page' : undefined}
          >
            Teilen
          </button>
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'preview' && (
          <div className="h-96 bg-gray-50 border rounded-md overflow-hidden">
            <iframe 
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
                    }
                    #app { padding: 16px; }
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
              title={`Vollansicht von ${app.title}`}
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">JavaScript-Code</h3>
              <button
                onClick={copyCodeToClipboard}
                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Code kopieren
              </button>
            </div>
            
            <div ref={codeRef} className="h-[400px] overflow-auto rounded-md">
              <SyntaxHighlighter 
                language="javascript" 
                style={vs2015}
                showLineNumbers={true}
                className="h-full"
              >
                {app.code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Teile diese App mit anderen
            </h3>
            
            {showQR && (
              <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
                <QRCode 
                  value={appUrl} 
                  size={200}
                  level="H"
                  includeMargin={true}
                  renderAs="canvas"
                />
              </div>
            )}
            
            <div className="w-full max-w-md">
              <label htmlFor="share-url" className="block text-sm font-medium text-gray-700 mb-1">
                Link zur App
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="share-url"
                  id="share-url"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={appUrl}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(appUrl);
                    alert('Link in die Zwischenablage kopiert!');
                  }}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                >
                  Kopieren
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 text-center mb-2">
                Oder teile direkt über:
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Schau dir diese App an: ${app.title} - ${appUrl}`)}`, '_blank')}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Über WhatsApp teilen"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`App-Empfehlung: ${app.title}`)}&body=${encodeURIComponent(`Schau dir diese App an: ${app.title}\n\n${appUrl}`)}`, '_blank')}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Über E-Mail teilen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AppDetailModal;