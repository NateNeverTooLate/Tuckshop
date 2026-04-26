import fetch from "node-fetch";
export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const owner = "NateNeverTooLate";
  const repo = "Tuckshop";
  const branch = "main";

  try {
    const file = req.query.file || "tuck.json";
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("File not found");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
