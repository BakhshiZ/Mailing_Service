import MainPage from "./components/MainPage/MainPage";
import SubscribeForm from "./components/SubscribeForm/SubscribeForm";
import BroadcastForm from "./components/BroadcastForm/BroadcastForm";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/subscribe" element={<SubscribeForm />} />
          <Route path="/broadcast" element={<BroadcastForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
