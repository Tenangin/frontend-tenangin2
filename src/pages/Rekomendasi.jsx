import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Rekomendasi.css'; // Pastikan path ini benar
import Sidebar from '../components/Sidebar';
// import Notifications from '../components/Notifications';
import Account from '../components/Account';
import useSidebarToggle from '../hooks/useSidebarToggle';
import { createRecommendation } from '../data/api/api';
import { getToken } from '../utils/auth';

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

const DEFAULT_LOCATION = { lat: -6.2088, lon: 106.8456 }; 
const TOP_K = 5;
// --- Komponen Utama ---
const Recomendasi = () => {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  
  // --- State & Refs ---
  const [recommendations, setRecommendations] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // State untuk lokasi user
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Menginisialisasi...');
  const hasFetchedRef = useRef(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null); 



  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Add window resize listener to invalidate map size
      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      // Cleanup listener on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon]);

  // Deteksi lokasi user (tetap seperti sebelumnya)
  useEffect(() => {
    setStatusMessage('Mendeteksi lokasi Anda...');
    console.log("test di ue2")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
        (error) => {
          setError('Gagal mendeteksi lokasi, menggunakan lokasi default., ' + error.message);
          console.error('Geolocation error:', error);
          setUserLocation(DEFAULT_LOCATION);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser ini. Menggunakan lokasi default.');
      setUserLocation(DEFAULT_LOCATION); 
    }
  }, [DEFAULT_LOCATION]);

  // Fetch rekomendasi hanya sekali setelah userLocation didapat
  useEffect(() => {
    if (!userLocation || hasFetchedRef.current) return;

    const fetchRecommendations = async () => {
      console.log("test")
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
        hasFetchedRef.current = true; // Set ref agar tidak fetch ulang
      }
    };

    fetchRecommendations();
  }, [userLocation, TOP_K]);

  // Tambahkan ini di dalam komponen Recomendasi (setelah useEffect lainnya)
useEffect(() => {
  const handleResize = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
useEffect(() => {
  if (mapInstanceRef.current) {
    setTimeout(() => {
      mapInstanceRef.current.invalidateSize();
    }, 500); // delay lebih lama dari sebelumnya
  }
}, [recommendations]);


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

  // Invalidate map size after userLocation changes to fix rendering issues on small screens
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [userLocation]);

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

  const [savedRecommendations, setSavedRecommendations] = useState(() => {
    const stored = localStorage.getItem('savedRecommendations');
    return stored ? JSON.parse(stored) : [];
  });

  const handleSaveRecommendations = async (psikolog) => {
    const alreadySaved = savedRecommendations.some(item => item.place_id === psikolog.place_id);
    console.log(savedRecommendations, 'savedRecommendations');
    console.log('Already saved:', alreadySaved, 'for', psikolog.name, 'id', psikolog.id);
    if (alreadySaved) {
      try {
        const token = getToken();
        const data = {
          clinics_id: psikolog.id,
          notes: "",
        };
        console.log("data:", data);
        const response = await createRecommendation(token, data);
        console.log('API createRecommendation response:', response);

        const updated = [...savedRecommendations, psikolog];
        setSavedRecommendations(updated);
        localStorage.setItem('savedRecommendations', JSON.stringify(updated));
        alert(`${psikolog.name} telah disimpan!, Cek Di Profile mu untuk mendapatkan Rute`);
      } catch (error) {
        console.error('Failed to save recommendation:', error);
        if (error && error.error && error.error.includes('duplicate key value')) {
          alert(`Rekomendasi ${psikolog.name} sudah ada di server.`);
        } else {
          alert(`Gagal menyimpan ${psikolog.name}. Silakan coba lagi.`);
        }
      }
    } else {
      alert(`${psikolog.name} sudah ada di daftar simpan.`);
    }
  };

  const handleOpenGoogleMaps = (lat, lon, event) => {
    event.stopPropagation();
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, '_blank');
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
          <div className="d-flex align-items-self-end gap-3" id='header-icons'>
            {/* <Notifications /> */}
            <Account />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4" id='header-container'>
          <h2 className="fw-bold text-primary">Rekomendasi Psikolog</h2>
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
              <div className="text-end mt-3">
                <button className="btn btn-primary" onClick={(event) => handleSaveRecommendations(psikolog, event)}>
                  Simpan
                </button>
                <button className="btn btn-secondary ms-2" onClick={(event) => handleOpenGoogleMaps(psikolog.latitude, psikolog.longitude, event)}>
                  <span className="bi bi-geo-alt-fill me-2" style={{ fontSize: '1.2rem' }}></span>
                  Buka di Google Maps
                </button>
              </div>
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