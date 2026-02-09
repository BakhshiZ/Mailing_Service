import { useEffect, useState } from "react";
import SubscribeForm from "../SubscribeForm/SubscribeForm";
import api from "../../src/api";
import "./MainPage.css";

const MainPage = () => {
  const [showSubForm, setShowSubForm] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const fetchSubscriberCount = async () => {
    try {
      const response = await api.get("/subscribers");
      console.log(response.data.count);
      setSubscriberCount(response.data.count);
    } catch (err) {
      console.error("Error while fetching subscriber count", err);
    }
  };

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const handleClickBroadcastBtn = () => {
    return;
  };

  return (
    <main>
      <div id="bg-rect">
        <h1>My Mailing List</h1>
        <p>The mailing list currently has {subscriberCount} members</p>
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
        <div id="subform">
          {showSubForm && <SubscribeForm onSuccess={fetchSubscriberCount} />}
        </div>
      </div>
    </main>
  );
};

export default MainPage;
