const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      res.status(400).send("Missing 'text' query parameter");
      return;
    }

    const formId = "1FAIpQLScvPGsfHcU1m4bF8zE7fa2KTElEs1trtC5XVjZIYuZYXkcY3g";
    const entryId = "504692446";
    const url = `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url&entry.${entryId}=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      res.status(response.status).send(response.statusText);
      return;
    }

    res.status(200).json({ message: "Submission successful" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(`Error: ${error.message}`);
  }
};
