import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
    }

    // 1. Anti-Scraper Headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");

    try {
        const db = await connectDB();
        const link = await db.collection('links').findOne({ token });

        if (!link) {
            return res.status(404).json({ error: 'Invalid or expired link' });
        }

        // 2. One-Time Use Check
        if (link.used) {
            return res.status(403).json({ error: 'This link has already been used' });
        }

        // 3. Referer Validation (Anti-Bypass)
        const referer = req.headers.referer || '';
        const baseUrl = process.env.BASE_URL || '';
        if (!referer.includes(baseUrl) || !referer.includes(`/s/${token}`)) {
            return res.status(403).json({ error: 'Bypass attempt detected. Please use the official bridge page.' });
        }

        // 4. Timing Handshake Check (Must wait at least 6 seconds)
        if (!link.first_viewed_at) {
            return res.status(403).json({ error: 'Handshake missing. Please refresh the bridge page.' });
        }

        const startTime = new Date(link.first_viewed_at).getTime();
        const now = new Date().getTime();
        const elapsedSeconds = (now - startTime) / 1000;

        if (elapsedSeconds < 6) { // Giving 2s buffer for network latency
            return res.status(403).json({ error: 'Please wait for the countdown to complete.' });
        }

        // 5. Mark as Used & Redirect
        await db.collection('links').updateOne(
            { token },
            {
                $set: { used: true, accessed_at: new Date() },
                $inc: { clicks: 1 }
            }
        );

        res.setHeader('Location', link.original_url);
        res.status(302).end();
    } catch (error) {
        console.error('Error fetching link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
