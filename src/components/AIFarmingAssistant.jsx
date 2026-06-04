import { useState } from "react";

const AIFarmingAssistant = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const parseResponse = async (res) => {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message =
        data && typeof data === "object" && data.message
          ? data.message
          : typeof data === "string"
          ? data
          : `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");

    if (!message) {
      setError("Enter a question or farming topic.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/assistant", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ message }),
      });
      const data = await parseResponse(res);
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not contact assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold">AI Farming Assistant</h2>
      <p className="text-sm text-slate-500">Ask questions and get fast farm guidance.</p>

      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded border p-3"
          rows="4"
          placeholder="e.g. When should I apply fertilizer for tomatoes?"
        />
        <button className="rounded bg-green-700 px-4 py-2 text-white" type="submit">
          {loading ? "Thinking..." : "Ask Assistant"}
        </button>
      </form>

      {response && (
        <div className="mt-4 rounded border bg-green-50 p-4">
          <div className="font-semibold">Assistant Response</div>
          <div className="text-sm text-slate-600 mt-2">{response}</div>
        </div>
      )}
    </div>
  );
};

export default AIFarmingAssistant;
