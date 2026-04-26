import fetch from "node-fetch";
export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.GITHUB_TOKEN;
  const owner = "NateNeverTooLate";
  const repo = "Tuckshop";
  const branch = "main";

  try {
    const { file, content } = req.body;
    const filePath = file || "tuck.json";

    let sha = null;

    const shaRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (shaRes.ok) {
      const data = await shaRes.json();
      sha = data.sha;
    }

    const encodedContent = Buffer.from(
      JSON.stringify(content, null, 2),
      "utf-8"
    ).toString("base64");

    const body = {
      message:
        filePath === "tuck.json"
          ? "Update tuckshop inventory"
          : "Add sales history",
      content: encodedContent,
      branch
    };

    if (sha) body.sha = sha;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.log("TOKEN EXISTS:", !!process.env.GITHUB_TOKEN);
console.log("TOKEN LENGTH:", process.env.GITHUB_TOKEN?.length);
console.log("TOKEN START:", process.env.GITHUB_TOKEN?.slice(0, 10));
      throw new Error(result.message || "GitHub update failed");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
console.log("TOKEN EXISTS:", !!process.env.GITHUB_TOKEN);
console.log("TOKEN LENGTH:", process.env.GITHUB_TOKEN?.length);
