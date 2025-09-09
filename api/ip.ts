import type { VercelRequest, VercelResponse } from '@vercel/node';

function handler(request: VercelRequest, response: VercelResponse) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    response.status(200).json({ip});
}

module.exports = handler;