import { VercelRequest, VercelResponse } from "@vercel/node";
import { computers } from "../db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const auth = request.headers.authorization;
    if (auth !== `Bearer ${process.env.API_KEY}`) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const name = request.query.name;
    if (typeof name !== 'string' || name.length === 0) {
        response.status(400).json({ error: 'Name is required' });
        return;
    }
    db.select().from(computers).where(eq(computers.name, name)).limit(1).then(existing => {
        if (existing.length > 0) {
            if (existing[0]) {
                response.status(200).json({ ip: Buffer.from(existing[0].ip).toString('base64') });
            } else {
                response.status(404).json({ error: 'Not found' });
            }
        } else {
            response.status(404).json({ error: 'Not found' });
        }
    }).catch(err => {
        console.error(err);
        response.status(500).json({ error: 'Internal server error' });
    });
}
module.exports = handler;