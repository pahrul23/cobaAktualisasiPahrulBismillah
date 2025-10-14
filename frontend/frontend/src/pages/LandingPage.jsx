import React, { useState, useEffect } from "react";
import kabagPhoto from "../assets/kabag.png";
import dediPhoto from "../assets/dedi.png";
import raraPhoto from "../assets/rara.png";
import didinPhoto from "../assets/didin.png";
import leoPhoto from "../assets/leo.png";
import pramPhoto from "../assets/pram.png";
import pahrulPhoto from "../assets/pahrul.png";
import febyPhoto from "../assets/feby.png";
import gigihPhoto from "../assets/gigih.png";
import sigitPhoto from "../assets/sigit.png";
import nadhiraPhoto from "../assets/nadhira.png";
import alfyPhoto from "../assets/alfy.png";
import lindaPhoto from "../assets/linda.png";
import ramaPhoto from "../assets/rama.png";
import anjarPhoto from "../assets/anjar.png";
import rizkyPhoto from "../assets/rizky.png";
import diyahPhoto from "../assets/diyah.png";
import gitaPhoto from "../assets/gita.png";

const LandingPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 20; i++) {
        newBubbles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 80 + 30,
          duration: Math.random() * 15 + 20,
          delay: Math.random() * 8,
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
  }, []);

  const handleLoginClick = () => {
    window.location.href = "/login";
  };

  const openImageModal = (imageData) => {
    setSelectedImage(imageData);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Data lengkap pegawai
  const pegawaiData = {
    "MOHAMMAD IKHSAN DEDY HASIBUAN": {
      nama: "MOHAMMAD IKHSAN DEDY HASIBUAN",
      nip: "197305251993031001",
      jabatan: "Kepala Bagian Sekretariat Ketua DPD RI",
      photo: dediPhoto,
    },
    "DIYAH TRI IRAWATI": {
      nama: "DIYAH TRI IRAWATI",
      nip: "198101172009112001",
      jabatan: "Kepala Sub Bagian Tata Usaha",
      photo: diyahPhoto,
    },
    "GITA PRISSANDI": {
      nama: "GITA PRISSANDI",
      nip: "198411232008011001",
      jabatan: "Kepala Sub Bagian Rapat dan Penyiapan Materi",
      photo: gitaPhoto,
    },
    "FABBIOLA MAUREEN": {
      nama: "FABBIOLA MAUREEN, S.H., M.H.",
      nip: "198502172011012010",
      jabatan: "Penelaah Teknis Kebijakan, Subbagian Penyiapan Materi",
      photo: febyPhoto,
    },
    "RAMA MAHESA": {
      nama: "RAMA MAHESA, S.E., M.M.",
      nip: "198505032015031002",
      jabatan:
        "Analis Legislatif Ahli Muda, Kelompok Jabatan Fungsional, Biro Sekretariat Pimpinan",
      photo: ramaPhoto,
    },
    "LINDA BR GINTING": {
      nama: "LINDA BR GINTING, S.I.P.",
      nip: "199601032022032012",
      jabatan:
        "Perisalah Legislatif Ahli Pertama, Kelompok Jabatan Fungsional, Biro Sekretariat Pimpinan",
      photo: lindaPhoto,
    },
    "BAIQ TIARA LOVYSAMINA ZAHIR": {
      nama: "BAIQ TIARA LOVYSAMINA ZAHIR, S.Sos.",
      nip: "199708152025062004",
      jabatan:
        "Penata Keprotokolan, Subbagian Acara dan Upacara, Bagian Protokol, Biro Protokol, Hubungan Masyarakat dan Media",
      photo: raraPhoto,
    },
    "AZIS DIYANTO PRAMUNDITO": {
      nama: "AZIS DIYANTO PRAMUNDITO, S.Sos.",
      nip: "200005272025061004",
      jabatan:
        "Penata Keprotokolan, Subbagian Acara dan Upacara, Bagian Protokol, Biro Protokol, Hubungan Masyarakat dan Media",
      photo: pramPhoto,
    },
    "ALFYANDA SHIRLEY": {
      nama: "ALFYANDA SHIRLEY, A.Md.A.B.",
      nip: "199804152022032011",
      jabatan:
        "Pengelola Keprotokolan, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: alfyPhoto,
    },
    "NADIRA SWANDANI": {
      nama: "NADIRA SWANDANI, A.Md.I.P.",
      nip: "199706062022032008",
      jabatan:
        "Pengolah Data dan Informasi, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: nadhiraPhoto,
    },
    "SIGIT KAMSENO": {
      nama: "SIGIT KAMSENO, S.T., M.A.",
      nip: "198208272007101002",
      jabatan:
        "Penelaah Teknis Kebijakan, Subbagian Perbendaharaan Belanja Dewan, Bagian Perbendaharaan",
      photo: sigitPhoto,
    },
    "GIGIH SIBADIO": {
      nama: "GIGIH SIBADIO",
      nip: "199009222025211013",
      jabatan:
        "Pengadministrasi Perkantoran, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: gigihPhoto,
    },
    PAHRUL: {
      nama: "PAHRUL, S.T.",
      nip: "200107282025061004",
      jabatan:
        "Penata Kelola Sistem dan Teknologi Informasi, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: pahrulPhoto,
    },
    "DIDIN ARDIANSYAH PRAYOGO": {
      nama: "DIDIN ARDIANSYAH PRAYOGO, A.Md.Par.",
      nip: "200105232025061008",
      jabatan:
        "Pengelola Keprotokolan, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: didinPhoto,
    },
    "LEONARD RODRIQUE OME": {
      nama: "LEONARD RODRIQUE OME, A.Md.",
      nip: "200104062025061005",
      jabatan:
        "Pengelola Keprotokolan, Subbagian Tata Usaha dan Kerumahtanggaan",
      photo: leoPhoto,
    },
    "ANJAR RIZKY SETIAWAN": {
      nama: "ANJAR RIZKY SETIAWAN",
      nip: "PEGAWAI PEMERINTAH NON PEGAWAI NEGERI",
      jabatan: "PPNPN",
      photo: anjarPhoto,
    },
    "RIZKY UNDANG BATARA": {
      nama: "RIZKY UNDANG BATARA",
      nip: "PEGAWAI PEMERINTAH NON PEGAWAI NEGERI",
      jabatan: "PPNPN",
      photo: rizkyPhoto,
    },
  };

  const stafPhotos = {
    "FABBIOLA MAUREEN": febyPhoto,
    "RAMA MAHESA": ramaPhoto,
    "ALFYANDA SHIRLEY": alfyPhoto,
    "NADIRA SWANDANI": nadhiraPhoto,
    "LINDA BR GINTING": lindaPhoto,
    "SIGIT KAMSENO": sigitPhoto,
    "GIGIH SIBADIO": gigihPhoto,
    PAHRUL: pahrulPhoto,
    "AZIS DIYANTO PRAMUNDITO": pramPhoto,
    "BAIQ TIARA LOVYSAMINA ZAHIR": raraPhoto,
    "LEONARD RODRIQUE OME": leoPhoto,
    "DIDIN ARDIANSYAH PRAYOGO": didinPhoto,
    "RIZKY UNDANG BATARA": rizkyPhoto,
    "ANJAR RIZKY SETIAWAN": anjarPhoto,
  };

  const subBagianRapat = [
    "FABBIOLA MAUREEN",
    "LINDA BR GINTING",
    "RAMA MAHESA",
    "BAIQ TIARA LOVYSAMINA ZAHIR",
    "AZIS DIYANTO PRAMUNDITO",
  ];

  const subBagianTU = [
    "ALFYANDA SHIRLEY",
    "NADIRA SWANDANI",
    "SIGIT KAMSENO",
    "GIGIH SIBADIO",
    "PAHRUL",
    "LEONARD RODRIQUE OME",
    "DIDIN ARDIANSYAH PRAYOGO",
    "RIZKY UNDANG BATARA",
    "ANJAR RIZKY SETIAWAN",
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#E8F4F8",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Bubbles Background */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={{
            position: "absolute",
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background:
              "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.12) 50%, rgba(16, 185, 129, 0.08) 100%)",
            borderRadius: "50%",
            animation: `floatBubble ${bubble.duration}s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            filter: "blur(3px)",
            zIndex: 0,
          }}
        />
      ))}

      {/* Wave Shape Top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: "relative",
            display: "block",
            width: "calc(100% + 1.3px)",
            height: "120px",
          }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            style={{ fill: "rgba(14, 165, 233, 0.1)" }}
          ></path>
        </svg>
      </div>

      {/* Image Modal - SAMA SEPERTI SEBELUMNYA */}
      {selectedImage && (
        <div
          onClick={closeImageModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(15px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.3s ease-out",
            cursor: "pointer",
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              animation: "zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "default",
            }}
          >
            <button
              onClick={closeImageModal}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                fontWeight: "300",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(239, 68, 68, 0.8)";
                e.target.style.transform = "rotate(90deg) scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "rotate(0deg) scale(1)";
              }}
            >
              ✕
            </button>

            <div
              style={{
                background: "white",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 30px 120px rgba(0, 0, 0, 0.6)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  position: "relative",
                  paddingTop: "100%",
                  background:
                    "linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)",
                }}
              >
                <img
                  src={selectedImage.photo}
                  alt={selectedImage.nama}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "2.5rem",
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                  color: "white",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "0.5rem 1rem",
                    display: "inline-block",
                    marginBottom: "1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  📋 Data Pegawai
                </div>

                <h3
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "2rem",
                    fontWeight: "800",
                    letterSpacing: "-0.025em",
                    lineHeight: "1.2",
                  }}
                >
                  {selectedImage.nama}
                </h3>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "1.25rem",
                      }}
                    >
                      🆔
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontSize: "0.75rem",
                          opacity: 0.8,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        NIP
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: "700",
                        }}
                      >
                        {selectedImage.nip}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "1.25rem",
                      }}
                    >
                      💼
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontSize: "0.75rem",
                          opacity: 0.8,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        Jabatan
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: "600",
                          lineHeight: "1.5",
                        }}
                      >
                        {selectedImage.jabatan}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "10px",
                      padding: "1rem",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      🏛️
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.7rem",
                        opacity: 0.9,
                        fontWeight: "600",
                      }}
                    >
                      DPD RI
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "10px",
                      padding: "1rem",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      👤
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.7rem",
                        opacity: 0.9,
                        fontWeight: "600",
                      }}
                    >
                      Sekretariat Ketua
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header - STICKY */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 5%",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              background:
                "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              color: "white",
              fontWeight: "800",
              boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
            }}
          >
            A
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "1.5rem",
                fontWeight: "800",
                letterSpacing: "-0.5px",
              }}
            >
              ADMIRE
            </h2>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "0.7rem",
                fontWeight: "500",
              }}
            >
              Smart System
            </p>
          </div>
        </div>

        <button
          onClick={handleLoginClick}
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            border: "none",
            color: "white",
            padding: "0.9rem 2rem",
            borderRadius: "50px",
            fontSize: "0.95rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 20px rgba(14, 165, 233, 0.3)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 30px rgba(14, 165, 233, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 20px rgba(14, 165, 233, 0.3)";
          }}
        >
          Masuk Sistem →
        </button>
      </nav>

      {/* Hero Section dengan Curved Background - SAMA SEPERTI SEBELUMNYA */}
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(232, 244, 248, 1) 100%)",
          borderRadius: "0 0 50% 50% / 0 0 5% 5%",
          paddingBottom: "4rem",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            padding: "3rem 5%",
            maxWidth: "1400px",
            margin: "0 auto",
            minHeight: "75vh",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left Content */}
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                borderRadius: "30px",
                padding: "0.6rem 1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "2rem",
                boxShadow: "0 8px 25px rgba(14, 165, 233, 0.25)",
              }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                }}
              >
                🏛️
              </span>
              <span
                style={{
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                SISTEM DIGITAL DPD RI
              </span>
            </div>

            <h1
              style={{
                fontSize: "3.8rem",
                fontWeight: "900",
                color: "#0f172a",
                margin: "0 0 1.5rem 0",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              Digitalisasi Sistem
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Persuratan
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "#475569",
                margin: "0 0 2.5rem 0",
                lineHeight: "1.8",
                fontWeight: "400",
                maxWidth: "550px",
              }}
            >
              Administrative Mail and Information Record for Efficiency (ADMIRE)
              - Solusi inovatif untuk mengelola surat, proposal, dan agenda
              secara digital di Sekretariat Ketua DPD RI.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleLoginClick}
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                  color: "white",
                  border: "none",
                  padding: "1.3rem 2.8rem",
                  borderRadius: "50px",
                  fontSize: "1.05rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 12px 35px rgba(14, 165, 233, 0.4)",
                  letterSpacing: "0.3px",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px) scale(1.02)";
                  e.target.style.boxShadow =
                    "0 16px 45px rgba(14, 165, 233, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow =
                    "0 12px 35px rgba(14, 165, 233, 0.4)";
                }}
              >
                Akses Sistem
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem 1.5rem",
                  background: "white",
                  borderRadius: "50px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Aman & Terpercaya
                </span>
              </div>
            </div>
          </div>

          {/* Right Illustration dengan Card 3D - SAMA */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                background:
                  "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                borderRadius: "35px",
                padding: "3rem 2.5rem",
                color: "white",
                position: "relative",
                boxShadow: "0 30px 80px rgba(14, 165, 233, 0.4)",
                transform: "perspective(1000px) rotateY(-5deg)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    margin: "0 auto 2rem",
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  🏛️
                </div>

                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "2.2rem",
                    fontWeight: "900",
                    letterSpacing: "-0.5px",
                  }}
                >
                  ADMIRE SYSTEM
                </h3>

                <p
                  style={{
                    margin: "0 0 2rem 0",
                    fontSize: "1.1rem",
                    opacity: 0.95,
                    fontWeight: "500",
                  }}
                >
                  Sekretariat Ketua DPD RI
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "15px",
                      padding: "1rem 0.5rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      📄
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      Surat
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "15px",
                      padding: "1rem 0.5rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      📊
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      Agenda
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "15px",
                      padding: "1rem 0.5rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      ✅
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      Arsip
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "150px",
                  height: "150px",
                  background: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "120px",
                  height: "120px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              ></div>
            </div>

            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "-5%",
                background: "white",
                borderRadius: "20px",
                padding: "1.2rem",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <div style={{ fontSize: "2.5rem" }}>📋</div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "15%",
                right: "-8%",
                background: "white",
                borderRadius: "18px",
                padding: "1rem",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.12)",
                animation: "float 3s ease-in-out infinite 1.5s",
              }}
            >
              <div style={{ fontSize: "2rem" }}>💼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Features Cards - SAMA */}
      <div
        style={{
          padding: "0 5%",
          maxWidth: "1400px",
          margin: "-5rem auto 0",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: "🕐",
              title: "Jam Operasional",
              desc: "Senin - Jumat\n08:00 - 16:00",
              color: "#0ea5e9",
            },
            {
              icon: "📅",
              title: "Buat Agenda",
              desc: "Jadwalkan kegiatan dan rapat dengan mudah",
              color: "#06b6d4",
            },
            {
              icon: "👥",
              title: "Cari Pegawai",
              desc: "Direktori lengkap pegawai Sekretariat",
              color: "#10b981",
            },
            {
              icon: "📍",
              title: "Lokasi",
              desc: "Gedung Nusantara DPD RI Jakarta",
              color: "#14b8a6",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: "25px",
                padding: "2rem 1.5rem",
                textAlign: "center",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: "2px solid transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 45px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}25 100%)`,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto 1.2rem",
                }}
              >
                {feature.icon}
              </div>
              <h4
                style={{
                  margin: "0 0 0.75rem 0",
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#64748b",
                  lineHeight: "1.5",
                  whiteSpace: "pre-line",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Services Section - Manajemen Persuratan & Agenda */}
      <div
        style={{
          padding: "8rem 5%",
          background: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                border: "2px solid rgba(14, 165, 233, 0.3)",
                borderRadius: "50px",
                padding: "0.85rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>✨</span>
              <span
                style={{
                  color: "#0ea5e9",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Layanan Kami
              </span>
            </div>

            <h2
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: "#0f172a",
                marginBottom: "1rem",
                letterSpacing: "-1px",
              }}
            >
              Fitur Unggulan ADMIRE
            </h2>
            <p
              style={{
                fontSize: "1.15rem",
                color: "#64748b",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.7",
              }}
            >
              Sistem terintegrasi untuk mempermudah administrasi dan pengelolaan
              dokumen di Sekretariat Ketua DPD RI
            </p>
          </div>

          {/* Manajemen Persuratan */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
              marginBottom: "8rem",
            }}
          >
            {/* Illustration Left */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  borderRadius: "40px",
                  padding: "3rem",
                  position: "relative",
                  boxShadow: "0 30px 80px rgba(14, 165, 233, 0.35)",
                  overflow: "hidden",
                }}
              >
                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                ></div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                  }}
                >
                  {/* Animated Document Icons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "100px",
                          height: "130px",
                          background: "white",
                          borderRadius: "15px",
                          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "1rem",
                          animation: `float 3s ease-in-out infinite ${
                            idx * 0.3
                          }s`,
                          transform: `translateY(${idx * 10}px)`,
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                          }}
                        >
                          📄
                        </div>
                        <div
                          style={{
                            width: "70%",
                            height: "4px",
                            background: "#e2e8f0",
                            borderRadius: "2px",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "50%",
                            height: "4px",
                            background: "#e2e8f0",
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                      }}
                    >
                      📋
                    </div>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: "0.85rem",
                          opacity: 0.9,
                          fontWeight: "600",
                        }}
                      >
                        Total Surat Terkelola
                      </p>
                      <h4
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "white",
                          fontSize: "2rem",
                          fontWeight: "900",
                        }}
                      >
                        1,234+
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  right: "-5%",
                  background: "white",
                  borderRadius: "20px",
                  padding: "1rem 1.5rem",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#0f172a",
                        fontWeight: "800",
                      }}
                    >
                      Terverifikasi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  borderRadius: "20px",
                  padding: "0.6rem 1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📨</span>
                <span
                  style={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Manajemen Persuratan
                </span>
              </div>

              <h3
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: "0 0 1.5rem 0",
                  letterSpacing: "-1px",
                  lineHeight: "1.15",
                }}
              >
                Kelola Surat dengan
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Lebih Efisien
                </span>
              </h3>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#64748b",
                  lineHeight: "1.8",
                  marginBottom: "2rem",
                }}
              >
                Sistem manajemen persuratan digital yang memudahkan pencatatan,
                pelacakan, dan arsip dokumen surat masuk dan keluar secara
                real-time dengan keamanan terjamin.
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  {
                    icon: "📥",
                    title: "Surat Masuk",
                    desc: "Pencatatan otomatis surat masuk",
                  },
                  {
                    icon: "📤",
                    title: "Surat Keluar",
                    desc: "Pengelolaan disposisi dan arsip",
                  },
                  {
                    icon: "🔍",
                    title: "Pelacakan",
                    desc: "Tracking status real-time",
                  },
                  {
                    icon: "🔒",
                    title: "Keamanan",
                    desc: "Enkripsi dan backup otomatis",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      background: "rgba(14, 165, 233, 0.05)",
                      padding: "1rem 1.5rem",
                      borderRadius: "15px",
                      border: "2px solid rgba(14, 165, 233, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(14, 165, 233, 0.1)";
                      e.currentTarget.style.borderColor = "#0ea5e9";
                      e.currentTarget.style.transform = "translateX(10px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(14, 165, 233, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(14, 165, 233, 0.1)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background:
                          "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h5
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontSize: "1.05rem",
                          fontWeight: "800",
                          color: "#0f172a",
                        }}
                      >
                        {feature.title}
                      </h5>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#64748b",
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLoginClick}
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                  color: "white",
                  border: "none",
                  padding: "1.2rem 2.5rem",
                  borderRadius: "50px",
                  fontSize: "1rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 12px 35px rgba(14, 165, 233, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 16px 45px rgba(14, 165, 233, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 12px 35px rgba(14, 165, 233, 0.3)";
                }}
              >
                Mulai Kelola Surat →
              </button>
            </div>
          </div>

          {/* Manajemen Agenda */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Content Left */}
            <div>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                  borderRadius: "20px",
                  padding: "0.6rem 1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📅</span>
                <span
                  style={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Manajemen Agenda
                </span>
              </div>

              <h3
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: "0 0 1.5rem 0",
                  letterSpacing: "-1px",
                  lineHeight: "1.15",
                }}
              >
                Kegiatan Ketua DPD RI
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Lebih Terorganisir
                </span>
              </h3>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#64748b",
                  lineHeight: "1.8",
                  marginBottom: "2rem",
                }}
              >
                Platform manajemen agenda terintegrasi untuk penjadwalan rapat,
                kegiatan, dan koordinasi tim dengan notifikasi otomatis dan
                reminder cerdas.
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  {
                    icon: "📆",
                    title: "Kalender Digital",
                    desc: "Lihat semua agenda dalam satu tampilan",
                  },
                  {
                    icon: "🔔",
                    title: "Notifikasi",
                    desc: "Pengingat otomatis sebelum acara",
                  },
                  {
                    icon: "👥",
                    title: "Kolaborasi",
                    desc: "Undang peserta dan kelola kehadiran",
                  },
                  {
                    icon: "📊",
                    title: "Laporan",
                    desc: "Analisis statistik kegiatan",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      background: "rgba(16, 185, 129, 0.05)",
                      padding: "1rem 1.5rem",
                      borderRadius: "15px",
                      border: "2px solid rgba(16, 185, 129, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(16, 185, 129, 0.1)";
                      e.currentTarget.style.borderColor = "#10b981";
                      e.currentTarget.style.transform = "translateX(10px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(16, 185, 129, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(16, 185, 129, 0.1)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background:
                          "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h5
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontSize: "1.05rem",
                          fontWeight: "800",
                          color: "#0f172a",
                        }}
                      >
                        {feature.title}
                      </h5>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#64748b",
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLoginClick}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                  color: "white",
                  border: "none",
                  padding: "1.2rem 2.5rem",
                  borderRadius: "50px",
                  fontSize: "1rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 12px 35px rgba(16, 185, 129, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 16px 45px rgba(16, 185, 129, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 12px 35px rgba(16, 185, 129, 0.3)";
                }}
              >
                Atur Jadwal Sekarang →
              </button>
            </div>

            {/* Illustration Right - 3D Calendar */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                  borderRadius: "40px",
                  padding: "3rem",
                  position: "relative",
                  boxShadow: "0 30px 80px rgba(16, 185, 129, 0.35)",
                  overflow: "hidden",
                  transform: "perspective(1000px) rotateY(5deg)",
                }}
              >
                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-50px",
                    left: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                ></div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {/* 3D Calendar Icon */}
                  <div
                    style={{
                      width: "100%",
                      background: "white",
                      borderRadius: "25px",
                      padding: "2rem",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
                      marginBottom: "2rem",
                    }}
                  >
                    {/* Calendar Header */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
                        borderRadius: "15px 15px 0 0",
                        padding: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: "1.5rem",
                          fontWeight: "900",
                        }}
                      >
                        Oktober 2025
                      </p>
                    </div>

                    {/* Calendar Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "0.5rem",
                      }}
                    >
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                        <div
                          key={idx}
                          style={{
                            textAlign: "center",
                            fontSize: "0.75rem",
                            fontWeight: "800",
                            color: "#64748b",
                            padding: "0.5rem 0",
                          }}
                        >
                          {day}
                        </div>
                      ))}
                      {[...Array(35)].map((_, idx) => {
                        const day = idx - 1;
                        const isToday = day === 13;
                        const hasEvent = [5, 10, 13, 18, 25].includes(day);

                        return (
                          <div
                            key={idx}
                            style={{
                              aspectRatio: "1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                              fontWeight: isToday ? "900" : "600",
                              background: isToday
                                ? "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)"
                                : hasEvent
                                ? "rgba(16, 185, 129, 0.1)"
                                : "transparent",
                              color: isToday ? "white" : "#0f172a",
                              position: "relative",
                              cursor: hasEvent ? "pointer" : "default",
                              transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                              if (hasEvent) {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.background =
                                  "rgba(16, 185, 129, 0.2)";
                              }
                            }}
                            onMouseOut={(e) => {
                              if (hasEvent) {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.background = isToday
                                  ? "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)"
                                  : "rgba(16, 185, 129, 0.1)";
                              }
                            }}
                          >
                            {day > 0 && day <= 31 ? day : ""}
                            {hasEvent && !isToday && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "3px",
                                  width: "4px",
                                  height: "4px",
                                  background: "#10b981",
                                  borderRadius: "50%",
                                }}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "15px",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 0.25rem 0",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        Agenda Bulan Ini
                      </p>
                      <h4
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: "2rem",
                          fontWeight: "900",
                        }}
                      >
                        24
                      </h4>
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "15px",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 0.25rem 0",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        Hari Ini
                      </p>
                      <h4
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: "2rem",
                          fontWeight: "900",
                        }}
                      >
                        3
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "5%",
                  left: "-5%",
                  background: "white",
                  borderRadius: "20px",
                  padding: "1rem 1.5rem",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
                  animation: "float 4s ease-in-out infinite 2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    🔔
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      Notifikasi
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#0f172a",
                        fontWeight: "800",
                      }}
                    >
                      Aktif
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Struktur Organisasi Section */}
      <div
        style={{
          marginTop: "8rem",
          padding: "6rem 5% 8rem",
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 40%, #10b981 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wave Shape Top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            transform: "rotate(180deg)",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: "relative",
              display: "block",
              width: "calc(100% + 1.3px)",
              height: "80px",
            }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              style={{ fill: "#E8F4F8" }}
            ></path>
          </svg>
        </div>

        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            width: "120px",
            height: "120px",
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation: "float 8s ease-in-out infinite",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "5%",
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite 2s",
          }}
        ></div>

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "5rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255, 255, 255, 0.35)",
                borderRadius: "50px",
                padding: "0.85rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>👥</span>
              <span
                style={{
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                TIM KAMI
              </span>
            </div>

            <h2
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: "white",
                marginBottom: "1.5rem",
                letterSpacing: "-1px",
                lineHeight: "1.15",
              }}
            >
              Struktur Organisasi
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                color: "rgba(255, 255, 255, 0.95)",
                maxWidth: "600px",
                margin: "0 auto",
                fontWeight: "500",
                lineHeight: "1.6",
              }}
            >
              Sekretariat Ketua DPD RI
            </p>
          </div>

          {/* Kepala Bagian - Card Style seperti gambar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "5rem",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "30px",
                padding: "2.5rem",
                maxWidth: "450px",
                width: "100%",
                textAlign: "center",
                position: "relative",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.25)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 35px 90px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 25px 70px rgba(0, 0, 0, 0.25)";
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                  borderRadius: "20px",
                  padding: "0.7rem 1.5rem",
                  marginBottom: "2rem",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  KEPALA BAGIAN
                </span>
              </div>

              <div
                onClick={() =>
                  openImageModal(pegawaiData["MOHAMMAD IKHSAN DEDY HASIBUAN"])
                }
                style={{
                  width: "200px",
                  height: "200px",
                  margin: "0 auto 2rem",
                  borderRadius: "25px",
                  overflow: "hidden",
                  border: "4px solid #0ea5e9",
                  boxShadow: "0 15px 40px rgba(14, 165, 233, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(14, 165, 233, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(14, 165, 233, 0.3)";
                }}
              >
                <img
                  src={dediPhoto}
                  alt="Mohammad Ikhsan Dedy Hasibuan"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                  borderRadius: "15px",
                  padding: "0.6rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: "#0ea5e9",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Kepala Bagian Sekretariat Ketua DPD RI
                </p>
              </div>

              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 0.75rem 0",
                  letterSpacing: "-0.5px",
                }}
              >
                MOHAMMAD IKHSAN DEDY HASIBUAN
              </h3>

              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                NIP: 197305251993031001
              </p>
            </div>
          </div>

          {/* Kepala Sub Bagian - Layout seperti gambar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2.5rem",
              marginBottom: "5rem",
              maxWidth: "1000px",
              margin: "0 auto 5rem",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "25px",
                padding: "2.5rem 2rem",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 15px 50px rgba(0, 0, 0, 0.15)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 70px rgba(0, 0, 0, 0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 50px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                onClick={() => openImageModal(pegawaiData["DIYAH TRI IRAWATI"])}
                style={{
                  width: "160px",
                  height: "160px",
                  margin: "0 auto 1.5rem",
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "3px solid #06b6d4",
                  boxShadow: "0 12px 35px rgba(6, 182, 212, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={diyahPhoto}
                  alt="Diyah Tri Irawati"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
                  borderRadius: "12px",
                  padding: "0.6rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: "#06b6d4",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Kepala Sub Bagian Tata Usaha
                </p>
              </div>

              <h4
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 0.5rem 0",
                }}
              >
                DIYAH TRI IRAWATI
              </h4>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                NIP: 198101172009112001
              </p>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "25px",
                padding: "2.5rem 2rem",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 15px 50px rgba(0, 0, 0, 0.15)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 70px rgba(0, 0, 0, 0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 50px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                onClick={() => openImageModal(pegawaiData["GITA PRISSANDI"])}
                style={{
                  width: "160px",
                  height: "160px",
                  margin: "0 auto 1.5rem",
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "3px solid #10b981",
                  boxShadow: "0 12px 35px rgba(16, 185, 129, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={gitaPhoto}
                  alt="Gita Prissandi"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                  borderRadius: "12px",
                  padding: "0.6rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: "#10b981",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Kepala Sub Bagian Rapat dan Penyiapan Materi
                </p>
              </div>

              <h4
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 0.5rem 0",
                }}
              >
                GITA PRISSANDI
              </h4>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                NIP: 198411232008011001
              </p>
            </div>
          </div>

          {/* STAF Section Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "50px",
                padding: "1rem 3rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>⭐</span>
              <span
                style={{
                  color: "white",
                  fontSize: "1.35rem",
                  fontWeight: "900",
                  letterSpacing: "2px",
                }}
              >
                STAF PELAKSANA
              </span>
            </div>
          </div>

          {/* Sub Bagian Rapat  */}
          <div style={{ marginBottom: "4rem" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255, 255, 255, 0.35)",
                borderRadius: "25px",
                padding: "1rem 2rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "1.15rem",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>📋</span>
                SUB BAGIAN RAPAT DAN PENYIAPAN MATERI
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {subBagianRapat.map((name, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 50px rgba(0, 0, 0, 0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0, 0, 0, 0.15)";
                  }}
                  onClick={() => openImageModal(pegawaiData[name])}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      margin: "0 auto 1.5rem",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "3px solid #0ea5e9",
                      boxShadow: "0 10px 25px rgba(14, 165, 233, 0.25)",
                    }}
                  >
                    <img
                      src={stafPhotos[name] || kabagPhoto}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#0f172a",
                      margin: 0,
                      fontWeight: "800",
                      lineHeight: "1.4",
                    }}
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Bagian TU - Grid seperti gambar */}
          <div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255, 255, 255, 0.35)",
                borderRadius: "25px",
                padding: "1rem 2rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "1.15rem",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>🏢</span>
                SUB BAGIAN TATA USAHA DAN KERUMAHTANGGAAN
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
              }}
            >
              {subBagianTU.map((name, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 50px rgba(0, 0, 0, 0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0, 0, 0, 0.15)";
                  }}
                  onClick={() => openImageModal(pegawaiData[name])}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      margin: "0 auto 1.5rem",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "3px solid #10b981",
                      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.25)",
                    }}
                  >
                    <img
                      src={stafPhotos[name] || kabagPhoto}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#0f172a",
                      margin: 0,
                      fontWeight: "800",
                      lineHeight: "1.4",
                    }}
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Shape Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: "relative",
              display: "block",
              width: "calc(100% + 1.3px)",
              height: "80px",
            }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              style={{ fill: "#E8F4F8" }}
            ></path>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          padding: "6rem 5%",
          background: "#E8F4F8",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            borderRadius: "40px",
            padding: "4rem 3rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              background:
                "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
              borderRadius: "50%",
            }}
          ></div>

          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "-60px",
              width: "180px",
              height: "180px",
              background:
                "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
              borderRadius: "50%",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                margin: "0 auto 2rem",
                boxShadow: "0 12px 35px rgba(14, 165, 233, 0.3)",
              }}
            >
              🚀
            </div>

            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                marginBottom: "1.5rem",
                letterSpacing: "-1px",
                color: "#0f172a",
              }}
            >
              Siap Bergabung dengan ADMIRE?
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                marginBottom: "3rem",
                color: "#64748b",
                lineHeight: "1.7",
                maxWidth: "600px",
                margin: "0 auto 3rem",
              }}
            >
              Wujudkan transformasi digital dalam pengelolaan administrasi
              persuratan di Sekretariat Ketua DPD RI
            </p>
            <button
              onClick={handleLoginClick}
              style={{
                background:
                  "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                color: "white",
                border: "none",
                padding: "1.4rem 3.5rem",
                borderRadius: "50px",
                fontSize: "1.15rem",
                fontWeight: "900",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 15px 40px rgba(14, 165, 233, 0.4)",
                letterSpacing: "0.5px",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-4px) scale(1.03)";
                e.target.style.boxShadow =
                  "0 20px 50px rgba(14, 165, 233, 0.5)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow =
                  "0 15px 40px rgba(14, 165, 233, 0.4)";
              }}
            >
              Mulai Sekarang →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "4rem 5% 3rem",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#94a3b8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            transform: "rotate(180deg)",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: "relative",
              display: "block",
              width: "calc(100% + 1.3px)",
              height: "60px",
            }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              style={{ fill: "#E8F4F8" }}
            ></path>
          </svg>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                color: "white",
                fontWeight: "900",
                boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)",
              }}
            >
              A
            </div>
            <div style={{ textAlign: "left" }}>
              <h3
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: "1.8rem",
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                }}
              >
                ADMIRE
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Smart Digital System
              </p>
            </div>
          </div>

          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)",
              margin: "2.5rem 0",
            }}
          ></div>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              margin: "0 0 1.5rem 0",
              color: "#cbd5e1",
              maxWidth: "800px",
              margin: "0 auto 2rem",
            }}
          >
            Dikembangkan oleh{" "}
            <strong style={{ color: "white", fontWeight: "800" }}>
              Pahrul, S.T.
            </strong>
            <br />
            <span style={{ fontSize: "0.9rem" }}>
              CPNS Penata Kelola Sistem dan Teknologi Informasi
              <br />
              Bagian Pengelolaan Sistem Informasi Biro Sindok Setjen{" "}
              <strong
                style={{
                  color: "#0ea5e9",
                  fontWeight: "800",
                }}
              >
                DPD RI
              </strong>
            </span>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "0.75rem 1.5rem",
                borderRadius: "15px",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#94a3b8",
              }}
            >
              © 2025 ADMIRE System
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "0.75rem 1.5rem",
                borderRadius: "15px",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#94a3b8",
              }}
            >
              DPD RI
            </div>
          </div>
        </div>
      </footer>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-15px); 
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.85);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes floatBubble {
          0% {
            transform: translateY(100vh) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;