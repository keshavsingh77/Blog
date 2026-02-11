import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token, action } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const db = await connectDB();

        if (action === 'start') {
            // Record when the user started viewing the gateway
            const result = await db.collection('links').updateOne(
                { token, first_viewed_at: { $exists: false } },
                { $set: { first_viewed_at: new Date() } }
            );

            return res.status(200).json({ success: true, message: 'Handshake initiated' });
        }

        res.status(400).json({ error: 'Invalid action' });
    } catch (error) {
        console.error('Handshake error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
