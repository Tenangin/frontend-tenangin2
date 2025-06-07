import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAssessment } from '../data/api/api.jsx';
import { getToken } from '../utils/auth.js';
import '../styles/HealthCheck.css';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Account from '../components/Account';
import useSidebarToggle from '../hooks/useSidebarToggle';

const HealthCheck = () => {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  const navigate = useNavigate();

  const [view, setView] = useState('start'); 
  const [resultData, setResultData] = useState(null);

  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoToDashboard = () => {
    navigate('/dashboard'); // belum diubah
  };

  const orderedFeatureNames = [
    "Sadness", "Euphoric", "Exhausted", "Sleep_dissorder",
    "Mood_Swing", "Suicidal_thoughts", "Anorxia", "Authority_Respect",
    "Try_Explanation", "Aggressive_Response", "Ignore_Move_On",
    "Nervous_Break_down", "Admit_Mistakes", "Overthinking",
    "Sexual_Activity", "Concentration", "Optimisim"
  ];

  const questions = [
    { id: 1, name: "Sadness", legend: "Seberapa sering Anda merasa sedih?", options: [{ text: "Sering", value: "0" }, { text: "Biasanya", value: "1" }, { text: "Kadang-kadang", value: "2" }, { text: "Jarang", value: "3" }] },
    { id: 2, name: "Euphoric", legend: "Seberapa sering Anda merasa euforia atau sangat bahagia secara tiba-tiba?", options: [{ text: "Sering", value: "0" }, { text: "Biasanya", value: "1" }, { text: "Kadang-kadang", value: "2" }, { text: "Jarang", value: "3" }] },
    { id: 3, name: "Exhausted", legend: "Seberapa sering Anda merasa sangat lelah secara emosional atau fisik?", options: [{ text: "Sering", value: "0" }, { text: "Biasanya", value: "1" }, { text: "Kadang-kadang", value: "2" }, { text: "Jarang", value: "3" }] },
    { id: 4, name: "Sleep_dissorder", legend: "Seberapa sering Anda mengalami gangguan tidur?", options: [{ text: "Sering", value: "0" }, { text: "Biasanya", value: "1" }, { text: "Kadang-kadang", value: "2" }, { text: "Jarang", value: "3" }] },
    { id: 5, name: "Mood_Swing", legend: "Apakah Anda sering mengalami perubahan suasana hati secara tiba-tiba?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 6, name: "Suicidal_thoughts", legend: "Apakah Anda pernah berpikiran untuk bunuh diri?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 7, name: "Anorxia", legend: "Apakah Anda pernah mengalami kehilangan nafsu makan yang ekstrem (anoreksia)?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 8, name: "Authority_Respect", legend: "Apakah Anda menghormati atau mengikuti otoritas (seperti guru, orang tua, atau pemimpin)?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 9, name: "Try_Explanation", legend: "Jika Anda melakukan kesalahan, apakah Anda cenderung mencoba memberikan penjelasan?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 10, name: "Aggressive_Response", legend: "Apakah Anda sering menunjukkan respons agresif saat merasa diserang secara emosional?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 11, name: "Ignore_Move_On", legend: "Apakah Anda lebih memilih untuk mengabaikan masalah dan melanjutkan hidup?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 12, name: "Nervous_Break_down", legend: "Pernahkah Anda mengalami gangguan saraf atau kelelahan mental yang ekstrem?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 13, name: "Admit_Mistakes", legend: "Apakah Anda berani mengakui kesalahan Anda kepada orang lain?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 14, name: "Overthinking", legend: "Apakah Anda sering overthinking?", options: [{ text: "YA", value: "1" }, { text: "TIDAK", value: "0" }], centered: true },
    { id: 15, name: "Sexual_Activity", legend: "Seberapa sering Anda melakukan aktivitas seksual?", options: Array.from({ length: 8 }, (_, i) => ({ text: (i + 1).toString(), value: i.toString() })) },
    { id: 16, name: "Concentration", legend: "Seberapa baik konsentrasi Anda?", options: Array.from({ length: 8 }, (_, i) => ({ text: (i + 1).toString(), value: i.toString() })) },
    { id: 17, name: "Optimisim", legend: "Seberapa tinggi tingkat optimisme Anda terhadap masa depan?", options: Array.from({ length: 8 }, (_, i) => ({ text: (i + 1).toString(), value: i.toString() })) },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (Object.keys(formData).length < orderedFeatureNames.length) {
        setError("Pastikan semua 17 pertanyaan telah dijawab.");
        setIsLoading(false);
        return;
    }

    const features = orderedFeatureNames.map(name => parseFloat(formData[name]));

    if (features.some(isNaN)) {
      setError("Terjadi kesalahan dalam memproses jawaban. Pastikan semua pilihan valid.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://rizaaf-klasifikasi-tf.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: features })
      });
      console.log(response);

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      
      setResultData(data);
      setView('results');

// =======
//       setResultData(data);
//       setView('results');

      // New code to save assessment data to backend
      const token = getToken();
      const condition = data.prediction || data.kondisi;
      const explanation = (() => {
        switch ((condition?.toLowerCase() ?? 'unknown')) {
          case "bipolar type-1":
            return "Bipolar Tipe 1 ditandai dengan episode mania berat, yang mungkin disertai depresi. Kondisi ini dapat memengaruhi aktivitas sehari-hari secara signifikan.";
          case "bipolar type-2":
            return "Bipolar Tipe 2 ditandai dengan pola episode depresi berat dan hipomania (bentuk mania yang lebih ringan).";
          case "depression":
            return "Depresi adalah gangguan suasana hati yang menyebabkan perasaan sedih terus-menerus, kehilangan minat, dan kelelahan.";
          case "normal":
            return "Hasil Anda menunjukkan tidak adanya indikasi gangguan mood seperti depresi atau bipolar. Tetap jaga kesehatan mental Anda.";
          default:
            return "Hasil tidak dikenali. Silakan ulangi tes atau konsultasikan dengan profesional.";
        }
      })();

      const assessmentData = {
        score: data.confidence,
        condition: condition,
        result_text: explanation,
      };
      console.log("Assessment Data:", assessmentData);

      if (token) {
        createAssessment(token, assessmentData)
          .then(res => {
            console.log("Assessment saved successfully:", res);
          })
          .catch(err => {
            console.error("Failed to save assessment:", err);
          });
      } else {
        console.warn("No token found, skipping assessment save.");
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleRetakeTest = () => {
    setView('start');
    setFormData({});
    setResultData(null);
    setError(null);
  };

  const getImageAndExplanation = (condition) => {
    switch (condition?.toLowerCase() ?? 'unknown') {
      case "bipolar type-1":
        return {
          image: "/images/bipolar1.png",
          explanation: "Bipolar Tipe 1 ditandai dengan episode mania berat, yang mungkin disertai depresi. Kondisi ini dapat memengaruhi aktivitas sehari-hari secara signifikan.",
        };
      case "bipolar type-2":
        return {
          image: "/images/bipolar2.png",
          explanation: "Bipolar Tipe 2 ditandai dengan pola episode depresi berat dan hipomania (bentuk mania yang lebih ringan).",
        };
      case "depression":
        return {
          image: "/images/depression.png",
          explanation: "Depresi adalah gangguan suasana hati yang menyebabkan perasaan sedih terus-menerus, kehilangan minat, dan kelelahan.",
        };
      case "normal":
        return {
          image: "/images/normal.png",
          explanation: "Hasil Anda menunjukkan tidak adanya indikasi gangguan mood seperti depresi atau bipolar. Tetap jaga kesehatan mental Anda.",
        };
      default:
        return {
          image: "/images/unknown.png",
          explanation: "Hasil tidak dikenali. Silakan ulangi tes atau konsultasikan dengan profesional.",
        };
    }
  };

  const renderStartTest = () => (
    <div className="healthcheck-container start-test-container">
      <h2>Tes Cek Kondisi Mental</h2>
      <p>
        Tes ini terdiri dari 17 pertanyaan yang dirancang untuk membantu Anda memahami kondisi mental Anda saat ini. 
        Hasil tes bersifat indikatif dan bukan merupakan diagnosis medis formal.
      </p>
      <div className="submit-button-container">
        {/* Ubah onClick untuk menampilkan kuesioner */}
        <button onClick={() => setView('questions')} className="start-test-button">
            Mulai Tes
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    const condition = resultData?.prediction || resultData?.kondisi;
    const { image, explanation } = getImageAndExplanation(condition);

    return (
      <div className="healthcheck-container result-container text-center">
        <h3>Hasil Tes Anda</h3>
        {resultData ? (
          <>
            <img
              src={image}
              alt={condition}
              className="img-fluid my-3"
              style={{ maxWidth: "300px", margin: "0 auto" }}
            />
            <div className="result-item">
              <strong>{condition}</strong>
            </div>
            <div className="result-item">
              <span>Probabilitas:</span> 
                {((resultData.confidence) * 100).toFixed(2)}%
            </div>
            <div className="result-explanation mt-3 mb-4">
              <p><strong>Penjelasan:</strong></p>
              <p>{explanation}</p>
            </div>
            <div className="result-note mt-4">
              <p><strong>Catatan:</strong></p>
              <p className="mb-0">
                Hasil ini adalah sebuah indikator awal dan <strong>bukan diagnosis medis</strong>. Ini adalah langkah yang baik untuk lebih mengenali diri sendiri. 
                Jika Anda merasa khawatir atau ingin mendapatkan pemahaman lebih dalam, jangan ragu untuk mengambil langkah berikutnya.
              </p>
              <p>
                Anda dapat menjelajahi fitur <strong>Rekomendasi Psikolog</strong> kami untuk menemukan dukungan profesional yang tepat.
              </p>
            </div>
            <div className="button-group">
              <button onClick={handleGoToDashboard} className="btn btn-outline-primary me-2">
                Kembali ke Dashboard
              </button>
              <button onClick={handleRetakeTest} className="btn btn-primary">
                Ulangi Tes
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-warning">Tidak ada data hasil untuk ditampilkan.</div>
        )}
      </div>
    );
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

      <div className={`flex-grow-1 p-3 p-md-4 content-area ${isSidebarVisible && !isMobile ? 'content-shifted' : ''}`} style={{ overflowY: 'auto' }}>
        <div className="toggle-button-container">
          <button className="btn btn-outline-primary mb-2 align-self-start mobile" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>

          <div className="d-flex align-items-center gap-3">
            <Notifications />
            <Account />
          </div>
        </div>

        <div className="d-flex flex-column m-4 position-relative align-items-center border-bottom pb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-primary">Health Check Kuesioner</h2>
          </div>
        </div>

        {view === 'start' && renderStartTest()}

        {view === 'questions' && (
          <div className="healthcheck-container">
            <form onSubmit={handleSubmit}>
              {questions.map(q => (
                <fieldset key={q.id} className="question-group">
                  <legend>{q.legend}</legend>
                  <div className={q.centered ? "centered-options" : "option-group"}>
                    {q.options.map(opt => (
                      <label key={opt.value} className="option-label">
                        <input
                          type="radio"
                          name={q.name}
                          value={opt.value}
                          checked={formData[q.name] === opt.value}
                          onChange={handleInputChange}
                          required
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <div className="submit-button-container">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Kirim'}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default HealthCheck;