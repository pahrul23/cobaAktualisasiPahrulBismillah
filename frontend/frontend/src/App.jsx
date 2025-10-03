// Path: /frontend/src/App.jsx - FIXED dengan ProposalList Ketua
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import StafDashboard from "./pages/Dashboard/StafDashboard";
import LettersList from "./pages/Letters/LettersList";
import LetterDetailPage from "./pages/Letters/LetterDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import DebugLetterForm from "./components/Debug/DebugLetterForm";
import ProposalsList from "./pages/Proposal/ProposalList";
import AgendaList from "./pages/Agenda/AgendaList";
import ReportsList from "./pages/Reports/ReportsList";
import Settings from "./pages/Settings/SettingsPage";

// Import Disposisi Page
import DisposisiPage from "./pages/Disposisi/DisposisiPage";

// NEW: Import untuk sistem ketua yang baru
import KetuaDashboardLayout from "./components/Layout/KetuaDashboardLayout";
import KetuaDashboard from "./pages/Ketua/KetuaDashboard";
import ApprovalCenter from "./pages/Ketua/ApprovalCenter/ApprovalCenter";
import ApprovalUndangan from "./pages/Ketua/ApprovalCenter/ApprovalUndangan";
import ApprovalAudiensi from "./pages/Ketua/ApprovalCenter/ApprovalAudiensi";

// TAMBAHKAN INI: Import ProposalList untuk Ketua
import KetuaProposalList from "./pages/Ketua/Proposal/ProposalList";

// NEW: Placeholder pages untuk ketua (sementara)
const PlaceholderPage = ({ title }) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p className="text-gray-600">
      Halaman {title} sedang dalam pengembangan...
    </p>
  </div>
);

// Lazy load AddLetter component with error handling
const AddLetter = lazy(() =>
  import("./pages/Letters/AddLetter").catch((error) => {
    console.warn("AddLetter component not found:", error);
    return {
      default: () => (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>AddLetter component tidak ditemukan</h2>
          <p>File AddLetter.jsx belum dibuat di /pages/Letters/</p>
        </div>
      ),
    };
  })
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "18px",
          color: "#64748b",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Staff - path khusus */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StafDashboard />
            </ProtectedRoute>
          }
        />

        {/* NEW: Dashboard Ketua dengan Layout terpisah */}
        <Route
          path="/dashboardKetua/*"
          element={
            <ProtectedRoute requireKetua={true}>
              <KetuaDashboardLayout>
                <Routes>
                  {/* Dashboard Utama - FIXED */}
                  <Route index element={<KetuaDashboard />} />

                  {/* Approval Center - PERBAIKAN DI SINI */}
                  <Route path="approval" element={<ApprovalCenter />} />
                  <Route
                    path="approval/undangan"
                    element={<ApprovalUndangan />}
                  />
                  <Route
                    path="approval/audiensi"
                    element={<ApprovalAudiensi />}
                  />

                  {/* Manajemen Surat */}
                  <Route
                    path="surat/semua"
                    element={<PlaceholderPage title="Semua Surat" />}
                  />
                  <Route
                    path="surat/disposisi"
                    element={<PlaceholderPage title="Manajemen Disposisi" />}
                  />
                  
                  {/* GANTI INI: Route Proposal untuk Ketua */}
                  <Route
                    path="proposal"
                    element={<KetuaProposalList />}
                  />

                  {/* Agenda */}
                  <Route
                    path="agenda"
                    element={<PlaceholderPage title="Agenda Ketua" />}
                  />

                  {/* Notifikasi */}
                  <Route
                    path="notifikasi"
                    element={<PlaceholderPage title="Notifikasi" />}
                  />

                  {/* Settings */}
                  <Route
                    path="settings"
                    element={<PlaceholderPage title="Pengaturan Ketua" />}
                  />

                  {/* Catch all untuk ketua */}
                  <Route
                    path="*"
                    element={<div className="p-6">Halaman tidak ditemukan</div>}
                  />
                </Routes>
              </KetuaDashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Smart redirect untuk authenticated users */}
        <Route
          path="/dashboard-redirect"
          element={
            user?.role === "ketua" || user?.role === "admin" ? (
              <Navigate to="/dashboardKetua" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Protected Routes untuk semua user */}
        <Route
          path="/letters"
          element={
            <ProtectedRoute>
              <LettersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/letters/:id"
          element={
            <ProtectedRoute>
              <LetterDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/letters/add"
          element={
            <ProtectedRoute>
              <Suspense
                fallback={
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Loading AddLetter...
                  </div>
                }
              >
                <AddLetter />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Surat Management - sesuai struktur sebelumnya */}
        <Route
          path="/surat"
          element={
            <ProtectedRoute>
              <LettersList />
            </ProtectedRoute>
          }
        />

        {/* Agenda Management - sesuai struktur sebelumnya */}
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <AgendaList />
            </ProtectedRoute>
          }
        />

        {/* Proposals - untuk semua role */}
        <Route
          path="/proposals"
          element={
            <ProtectedRoute>
              <ProposalsList />
            </ProtectedRoute>
          }
        />

        {/* Disposisi Management - untuk semua role */}
        <Route
          path="/disposisi"
          element={
            <ProtectedRoute>
              <DisposisiPage />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Notifications - sesuai struktur sebelumnya */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          }
        />

        {/* Debug route - hanya untuk development */}
        <Route
          path="/debug-form"
          element={
            <ProtectedRoute>
              <DebugLetterForm />
            </ProtectedRoute>
          }
        />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;