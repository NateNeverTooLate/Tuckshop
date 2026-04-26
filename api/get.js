export default async function handler(req, res) {
  const owner = "NateNeverTooLate";
  const repo = "Tuckshop";
  const branch = "main";

  try {
    const file = req.query.file || "tuck.json";

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    res.status(200).json(JSON.parse(content));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
