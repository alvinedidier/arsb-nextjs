import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    console.log("Handler invoked");  // Log pour vérifier que le gestionnaire est appelé

    // Vérifiez que res est défini et est un objet de réponse HTTP valide
    if (!res || typeof res.status !== 'function' || typeof res.json !== 'function') {
        console.error("Response object 'res' is undefined or invalid.");
        return; // Sortie précoce en cas d'erreur
    }

    const { query } = req;

    // Vérifiez que req et req.query sont définis
    if (!query || !query.slug || typeof query.slug !== 'string' || !query.slug.match(/^[\w-]+$/)) {
        return res.status(400).json({ message: 'Invalid slug' });
    }

    const { slug } = query;

    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            password: process.env.MYSQL_PASSWORD
        });

        const [results] = await connection.execute(
            'SELECT * FROM `asb_campaigns` INNER JOIN `asb_advertisers` ON `asb_advertisers`.`advertiser_id` = `asb_campaigns`.`advertiser_id` WHERE `campaign_crypt` = ?',
            [slug]
        );

        await connection.end();

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (err) {
        console.error("Error during database query or response handling:", err);
        if (res && typeof res.status === 'function') {
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.error("Cannot send error response because 'res' is not defined or has no 'status' method.");
        }
    }
}
