import { useState } from "react";
import api from "../../src/api";
import "./SubscribeForm.css";

interface Props {
  onSuccess: () => void;
}

const SubscribeForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [helperText, setHelperText] = useState("Unsubscribe here");
  const [subscribed, setSubscribed] = useState(false);

  const addSubscriber = async (email: string) => {
    await api.post("/add_user", { user_email: email });
    alert("Successfully Subscribed!");
    setEmail("");
    setEmail2("");
    onSuccess();
  };

  const delSubscriber = async (email: string) => {
    await api.delete("/remove_user", { data: { user_email: email } });
    alert("Successfully Unsubscribed!");
    setEmail("");
    setEmail2("");
    onSuccess();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email != email2) {
      alert("Error. Emails are not the same. Please check them again.");
      return;
    }

    if (subscribed) {
      delSubscriber(email);
    } else {
      addSubscriber(email);
    }
    return;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail2(e.target.value);
  };

  const handleSubscribedChange = () => {
    setSubscribed(!subscribed);
    helperText === "Unsubscribe here"
      ? setHelperText("Subscribe here")
      : setHelperText("Unsubscribe here");
  };

  let btn_label = "";
  let btn_type = "";
  subscribed ? (btn_label = "Unsubscribe") : (btn_label = "Subscribe");
  subscribed
    ? (btn_type = "btn btn-outline-danger")
    : (btn_type = "btn btn-outline-primary");
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Confirm Email:</label>
          <input type="email" name="email2" onChange={handleChange2} />
        </div>

        <input type="submit" className={btn_type} value={btn_label} />

        <span>Already subscribed?</span>
        <span>
          <strong
            onClick={handleSubscribedChange}
            style={{ color: subscribed ? "#0d6efd" : "#dc3545", opacity: 0.8 }}
          >
            {helperText}
          </strong>
        </span>
      </form>
    </>
  );
};

export default SubscribeForm;
