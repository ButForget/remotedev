import type { VercelRequest, VercelResponse } from '@vercel/node';
import {drizzle} from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";
import {computers} from "../db/schema";
import {eq} from "drizzle-orm";
const db = drizzle(neon(process.env.DATABASE_URL!));
async function handler(request: VercelRequest, response: VercelResponse) {
    const auth = request.headers.authorization;
    if(auth !== `Bearer ${process.env.API_KEY}`) {
        response.status(401).json({error: 'Unauthorized'});
        return;
    }
    const ip = request.body.ip;
    const name = request.query.name;
    if(typeof name !== 'string' || name.length === 0) {
        response.status(400).json({error: 'Name is required'});
        return;
    }
    const existing = await db.select().from(computers).where(eq(computers.name, name)).limit(1);
    if(existing.length > 0) {
        if (existing[0]) {
            await db.update(computers).set({ip: ip as string}).where(eq(computers.id, existing[0].id));
        }
    } else {
        await db.insert(computers).values({name, ip: ip as string});
    }
    response.status(200).json({status: 'success', ip});
}

module.exports = handler;