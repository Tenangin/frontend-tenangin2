import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Rekomendasi.css'; // Pastikan path ini benar
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Account from '../components/Account';
import useSidebarToggle from '../hooks/useSidebarToggle';

// --- Helper Function (Tidak Berubah) ---
const getRatingStars = (rating) => {
  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating <= 0) return '<span>Rating tidak tersedia</span>';
  
  const fullStars = Math.floor(numRating);
  const halfStar = numRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += '★';
  if (halfStar) starsHTML += '½';
  for (let i = 0; i < emptyStars; i++) starsHTML += '☆';
  
  return `<span class="rating-stars">${starsHTML}</span> (${numRating.toFixed(1)})`;
};

// --- Komponen Utama ---
const Recomendasi = () => {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  
  // --- State & Refs ---
  const [recommendations, setRecommendations] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // State untuk lokasi user
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Menginisialisasi...');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null); 

  const DEFAULT_LOCATION = { lat: -6.2088, lon: 106.8456 }; 
  const TOP_K = 5;

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  useEffect(() => {
    setStatusMessage('Mendeteksi lokasi Anda...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          setError('Tidak dapat mengakses lokasi. Menggunakan lokasi default (Jakarta).');
          setUserLocation(DEFAULT_LOCATION); 
        }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser ini. Menggunakan lokasi default.');
      setUserLocation(DEFAULT_LOCATION); 
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return; 

    const fetchRecommendations = async () => {
      setStatusMessage('Mengambil rekomendasi...');
      setIsLoading(true);
      const apiUrl = `https://rizaaf-rekomendasi.hf.space/recommend?lat=${encodeURIComponent(userLocation.lat)}&lon=${encodeURIComponent(userLocation.lon)}&top_k=${TOP_K}`;
      
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setRecommendations(data || []);
        setStatusMessage(data && data.length > 0 ? `Berikut adalah rekomendasi psikolog terdekat dari lokasi Anda.` : 'Tidak ada rekomendasi ditemukan di sekitar Anda.');
      } catch (err) {
        setError(err.message);
        setStatusMessage(`Gagal mengambil data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userLocation]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds();

    if (userLocation) {
        const userLatLng = [userLocation.lat, userLocation.lon];
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng(userLatLng);
        } else {
            userMarkerRef.current = L.marker(userLatLng, {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                })
            }).bindPopup('<b>Lokasi Anda</b>').addTo(map);
        }
        bounds.extend(userLatLng);
    }

    // Tambah marker rekomendasi
    recommendations.forEach((psikolog) => {
      if (psikolog.latitude !== undefined && psikolog.longitude !== undefined) {
        const marker = L.marker([psikolog.latitude, psikolog.longitude], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
          })
        }).bindPopup(`<b>${psikolog.name}</b><br>${psikolog.category}`);
        
        markersLayer.addLayer(marker);
        bounds.extend([psikolog.latitude, psikolog.longitude]);
      }
    });
    
    // Atur view peta agar semua marker terlihat
    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [recommendations, userLocation]);

  const handleListItemClick = (lat, lon) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([lat, lon], 15);
      // Cari marker yang sesuai dan buka popup-nya
      markersLayerRef.current.eachLayer(layer => {
        const layerLatLng = layer.getLatLng();
        if (layerLatLng.lat === lat && layerLatLng.lng === lon) {
          layer.openPopup();
        }
      });
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {isSidebarVisible && (
        <div className="sidebar-wrapper">
          <Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
        </div>
      )}

      {isSidebarVisible && isMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarVisible(false)} />
      )}

      <div className={`flex-grow-1 p-3 p-md-4 content-area ${isSidebarVisible && !isMobile ? 'content-shifted' : ''}`}>
        <div className="toggle-button-container">
          <button className="btn btn-outline-primary mb-2 align-self-start mobile" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary">Rekomendasi Psikolog</h4>
          <div className="d-flex align-items-center gap-3">
            <Notifications />
            <Account />
          </div>
        </div>

        <div className="recommendation-page-container">
          <header className="header-text">
            <h4><strong>Temui Psikolog Terbaik di Sekitar Anda</strong></h4>
          </header>
          <div className="content-wrapper">
            
            <div className="map-container">
              <div id="map" ref={mapContainerRef}></div>
            </div>

            <div className="info-list-container">
              <div className="status-area">
                <p id="statusMessage">{statusMessage}</p>
                {error && <p className="text-danger">Error: {error}</p>}
                {isLoading && <div className="loading-spinner"></div>}
              </div>
              
              <div className={`recommendation-list-area ${recommendations.length === 0 && !isLoading ? 'hidden' : ''}`}>
                <ul className="recommendation-list">
                  {!isLoading && recommendations.map((psikolog, index) => (
                    <li key={psikolog.place_id || index} onClick={() => handleListItemClick(psikolog.latitude, psikolog.longitude)}>
                      <h3>{psikolog.name || "Nama tidak tersedia"}</h3>
                      <p>{psikolog.category || "Kategori tidak diketahui"}</p>
                      <p>{psikolog.addres_full || "Alamat tidak tersedia"}{psikolog.provinsi ? `, ${psikolog.provinsi}` : ''}</p>
                      <p dangerouslySetInnerHTML={{ __html: `Rating: ${getRatingStars(psikolog.rating)} (${psikolog.review_count || 0} ulasan)` }} />
                      {psikolog.jarak_km !== undefined && <p className="italic-text">Perkiraan Jarak: {parseFloat(psikolog.jarak_km).toFixed(2)} km</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Recomendasi;