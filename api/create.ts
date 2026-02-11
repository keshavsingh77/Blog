import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { original_url } = req.body;

        if (!original_url) {
            return res.status(400).json({ error: 'original_url is required' });
        }

        // Generate a secure 8-character hex token
        const token = crypto.randomBytes(4).toString('hex');

        const db = await connectDB();
        await db.collection('links').insertOne({
            token,
            original_url,
            created_at: new Date(),
            clicks: 0,
        });

        const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;

        res.status(200).json({
            token,
            safelink: `${baseUrl}/s/${token}`,
        });
    } catch (error) {
        console.error('Error creating link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
