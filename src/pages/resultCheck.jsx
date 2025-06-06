// src/pages/ResultCheck.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // 1. Impor useLocation dan Link

const ResultCheck = () => {
  // 2. Gunakan hook useLocation untuk mendapatkan akses ke data navigasi
  const location = useLocation();

  // 3. Ambil data dari `location.state`. Gunakan optional chaining (?.) untuk keamanan
  const result = location.state?.resultData;

  // 4. Jika pengguna mengakses halaman ini secara langsung (tanpa data), tampilkan pesan
  if (!result) {
    return (
      <div className="container text-center mt-5">
        <h2>Hasil Tes Tidak Ditemukan</h2>
        <p>Anda harus menyelesaikan kuesioner terlebih dahulu untuk melihat hasilnya.</p>
        <Link to="/" className="btn btn-primary">
          Kembali ke Kuesioner
        </Link>
      </div>
    );
  }

  // 5. Jika data ada, tampilkan hasilnya
  return (
    <div className="container mt-5">
      <div className="card text-center">
        <div className="card-header bg-primary text-white">
          <h3>Hasil Tes Kondisi Mental Anda</h3>
        </div>
        <div className="card-body">
          <p className="card-text">Berdasarkan jawaban Anda, berikut adalah indikasi kondisi mental Anda:</p>
          <h4 className="card-title text-success">{result.kondisi}</h4>
          <p className="card-text">
            <strong>Tingkat Keyakinan Prediksi:</strong> {(result.confidence * 100).toFixed(2)}%
          </p>
          <hr />
          <div className="alert alert-warning" role="alert">
            <strong>Disclaimer:</strong> Hasil ini adalah prediksi berdasarkan model dan bukan merupakan diagnosis medis formal. Untuk diagnosis yang akurat, silakan berkonsultasi dengan profesional kesehatan mental seperti psikolog atau psikiater.
          </div>
        </div>
        <div className="card-footer text-muted">
          <Link to="/" className="btn btn-secondary">
            Ulangi Tes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultCheck;