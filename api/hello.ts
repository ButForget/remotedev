import type { VercelRequest, VercelResponse } from "@vercel/node";

function handler(request: VercelRequest, response: VercelResponse) {
    response.status(200).json({ message: "Hello World" });
}

module.exports = handler;