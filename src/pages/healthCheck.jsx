// src/pages/HealthCheck.jsx
import React, { useState } from 'react';
import '../styles/HealthCheck.css'; // Impor file CSS
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Account from '../components/Account';
import useSidebarToggle from '../hooks/useSidebarToggle';

const HealthCheck = () => {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  // ... (state lainnya tetap sama)
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testStarted, setTestStarted] = useState(false); // Untuk halaman awal

  const orderedFeatureNames = [
    "Sadness", "Euphoric", "Exhausted", "Sleep_dissorder",
    "Mood_Swing", "Suicidal_thoughts", "Anorxia", "Authority_Respect",
    "Try_Explanation", "Aggressive_Response", "Ignore_Move_On",
    "Nervous_Break_down", "Admit_Mistakes", "Overthinking",
    "Sexual_Activity", "Concentration", "Optimisim"
  ];

  const questions = [
    // ... (definisi questions tetap sama)
    { id: 1, name: "Sadness", legend: "Seberapa sering Anda merasa sedih?", options: [{ text: "Most-Often", value: "0" }, { text: "Seldom", value: "1" }, { text: "Sometimes", value: "2" }, { text: "Usually", value: "3" }] },
    { id: 2, name: "Euphoric", legend: "Seberapa sering Anda merasa euforia atau sangat bahagia secara tiba-tiba?", options: [{ text: "Most-Often", value: "0" }, { text: "Seldom", value: "1" }, { text: "Sometimes", value: "2" }, { text: "Usually", value: "3" }] },
    { id: 3, name: "Exhausted", legend: "Seberapa sering Anda merasa sangat lelah secara emosional atau fisik?", options: [{ text: "Most-Often", value: "0" }, { text: "Seldom", value: "1" }, { text: "Sometimes", value: "2" }, { text: "Usually", value: "3" }] },
    { id: 4, name: "Sleep_dissorder", legend: "Seberapa sering Anda mengalami gangguan tidur?", options: [{ text: "Most-Often", value: "0" }, { text: "Seldom", value: "1" }, { text: "Sometimes", value: "2" }, { text: "Usually", value: "3" }] },
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
    // ... (fungsi tetap sama)
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    // ... (fungsi tetap sama)
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    let allQuestionsAnswered = true;
    for (const name of orderedFeatureNames) {
      if (formData[name] === undefined) {
        allQuestionsAnswered = false;
        break;
      }
    }

    if (!allQuestionsAnswered) {
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

      if (!response.ok) {
        let errorDetail = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorDetail = errorData.detail.map(err => `${err.loc ? err.loc.join(' -> ') + ': ' : ''}${err.msg}`).join('; ');
            } else {
              errorDetail = errorData.detail;
            }
          }
        } catch { }
        throw new Error(errorDetail);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStartTest = () => (
    // ... (fungsi tetap sama)
    <div className="healthcheck-container start-test-container">
      <h2>Tes Cek Kondisi Mental</h2>
      <p>
        Tes ini terdiri dari 17 pertanyaan yang dirancang untuk membantu Anda memahami kondisi mental Anda saat ini. 
        Hasil tes bersifat indikatif dan bukan merupakan diagnosis medis formal.
      </p>
      <div class="submit-button-container">
        <button onClick={() => setTestStarted(true)} className="start-test-button">
            Mulai Tes
        </button>
        </div>
    </div>
  );

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Berikan class pada Sidebar atau wrapper jika Sidebar tidak bisa diubah langsung */}
      {isSidebarVisible && (
        <div className="sidebar-wrapper"> {/* Anda bisa gunakan class ini, atau pastikan Sidebar component Anda memiliki class yang bisa ditargetkan */}
          <Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
        </div>
      )}

      {isSidebarVisible && isMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarVisible(false)} />
      )}

      <div 
        className={`flex-grow-1 p-3 p-md-4 content-area ${isSidebarVisible && !isMobile ? 'content-shifted' : ''}`} 
        style={{ overflowY: 'auto' }}
      >
        <div className="toggle-button-container">
          <button className="btn btn-outline-primary mb-2 align-self-start mobile" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className="d-flex flex-column mb-4 position-relative">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold text-primary">Health Check Kuesioner</h4>
            <div className="d-flex align-items-center gap-3">
              <Notifications />
              <Account />
            </div>
          </div>
        </div>

        {!testStarted ? renderStartTest() : (
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
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              {error && <div className="alert alert-danger">{error}</div>}
              {result && <div className="alert alert-success">Hasil: {JSON.stringify(result)}</div>}
              <div className="submit-button-container">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Kirim'}
                </button>
                </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;