import { useState } from "react";
import { aiAPI } from "../api/apiServices";

const AIFarmingAssistant = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await aiAPI.farmingAssistant(message);
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not contact assistant");
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
