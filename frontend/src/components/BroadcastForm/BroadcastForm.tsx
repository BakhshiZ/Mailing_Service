import { useState } from "react";
import api from "../../api";

const BroadcastForm = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setMessage(null);

    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/broadcast", {
        subject,
        body,
      });

      setMessage("Broadcast started successfully.");
      setSubject("");
      setBody("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to send broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h2>Broadcast Email</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea
            className="form-control"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-outline-warning"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {message && <div className="alert alert-success mt-3">{message}</div>}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </main>
  );
};

export default BroadcastForm;
