import { useState } from "react";
import api from "../../src/api";
import "./SubscribeForm.css";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [helperText, setHelperText] = useState("Unsubscribe here");
  const [subscribed, setSubscribed] = useState(false);

  const addSubscriber = async (email: string) => {
    await api.post("/add_user", { user_email: email });
    alert("Successfully Subscribed!");
  };

  const delSubscriber = async (email: string) => {
    await api.delete("/remove_user", { data: { user_email: email } });
    alert("Successfully Unsubscribed!");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !email.includes("@") ||
      !email.includes(".") ||
      !email2.includes("@") ||
      !email2.includes(".")
    ) {
      alert("Error. invalid email entered. Please check again.");
      return;
    }

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
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} />
        </label>

        <label>
          Confirm Email:
          <input type="text" name="email2" onChange={handleChange2} />
        </label>

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
