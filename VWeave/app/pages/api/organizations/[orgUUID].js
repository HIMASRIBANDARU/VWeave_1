export default async (req, res) => {
    try {
        res.json(req.query)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
