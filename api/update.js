export const config = {
  runtime: "nodejs"
};
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.GITHUB_TOKEN;
  const owner = "NateNeverTooLate";
  const repo = "Tuckshop";
  const branch = "main";

  try {
    const { file, content } = req.body;
    const filePath = file || "tuck.json";

    // Get current SHA
    let sha = null;
    try {
      const shaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        headers: { Authorization: `token ${token}` }
      });
      if (shaRes.ok) {
        const data = await shaRes.json();
        sha = data.sha;
      }
    } catch (e) {}

   const encodedContent = Buffer.from(
  JSON.stringify(content, null, 2),
  "utf-8"
).toString("base64");

    const body = {
      message: filePath === "tuck.json" ? "Update tuckshop inventory" : "Add sales history",
      content: encodedContent,
      branch: branch
    };
    if (sha) body.sha = sha;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
