// src/components/Dashboard.js
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AppTile from './AppTile';
import AddAppModal from './AddAppModal';
import AppDetailModal from './AppDetailModal';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import FirebaseStatus from './FirebaseStatus'; // Neue Komponente importieren

const Dashboard = () => {
  const { apps, loading, error } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Apps filtern basierend auf Suchbegriff
  const filteredApps = apps.filter(app =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.tags && app.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-gray-800">
              App-Sharing Dashboard
            </h1>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Apps suchen..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Apps suchen"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Suche zurücksetzen"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Neue App hinzufügen"
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Neue App
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Firebase-Status-Anzeige einfügen */}
        <FirebaseStatus />

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {filteredApps.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  {searchTerm ? 'Keine Apps gefunden' : 'Noch keine Apps vorhanden'}
                </h2>
                <p className="mt-2 text-gray-500">
                  {searchTerm ? `Keine Ergebnisse für "${searchTerm}"` : 'Füge eine neue App hinzu, um zu beginnen.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Suche zurücksetzen
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map(app => (
                  <AppTile 
                    key={app.id} 
                    app={app} 
                    onClick={() => setSelectedApp(app)} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AddAppModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      {selectedApp && (
        <AppDetailModal 
          app={selectedApp} 
          isOpen={!!selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;