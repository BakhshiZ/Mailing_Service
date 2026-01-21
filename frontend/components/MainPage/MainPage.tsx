import { useState } from "react";
import SubscribeForm from "../SubscribeForm/SubscribeForm";
import "./MainPage.css";
const MainPage = () => {
  const [showSubForm, setShowSubForm] = useState(false);

  const handleClickBroadcastBtn = () => {
    return;
  };

  return (
    <main>
      <div id="bg-rect">
        <h1>My Mailing List</h1>
        <p>The mailing list currently has x members</p>
        <div className="btns">
          <div id="subscribe-btn">
            <button
              className="btn btn-outline-success"
              onClick={() => {
                setShowSubForm(!showSubForm);
              }}
            >
              Subscribe/Unsubscribe
            </button>
          </div>
          <div id="broadcast-btn">
            <button
              className="btn btn-outline-warning"
              onClick={handleClickBroadcastBtn}
            >
              Broadcast email
            </button>
          </div>
        </div>
        <div id="subform">{showSubForm && <SubscribeForm />}</div>
      </div>
    </main>
  );
};

export default MainPage;
