import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const db = await connectDB();
        const link = await db.collection('links').findOne({ token });

        if (!link) {
            return res.status(404).json({ error: 'Invalid or expired link' });
        }

        // Increment click count asynchronously
        db.collection('links').updateOne(
            { token },
            { $inc: { clicks: 1 } }
        ).catch(err => console.error('Error updating click count:', err));

        // Redirect to the original URL
        res.setHeader('Location', link.original_url);
        res.status(302).end();
    } catch (error) {
        console.error('Error fetching link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
