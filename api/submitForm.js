const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { text } = req.query;
  const formId = "1FAIpQLScvPGsfHcU1m4bF8zE7fa2KTElEs1trtC5XVjZIYuZYXkcY3g";
  const entryId = "504692446";
  const url = `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url&entry.${entryId}=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url, { method: "POST", mode: "no-cors" });
    res.status(200).json({ message: "Submission successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Submission failed" });
  }
};
