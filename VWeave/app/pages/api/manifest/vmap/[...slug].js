import { sendVMAP } from "./utils";

export default async (req, res) => {
    try {
        const vpx = "https://tv.springserve.com/vast/"
        let categoryBreaks = []
        const { slug } = req.query
        if(slug[0] === 'pre_post') {
            categoryBreaks = [['timeOffset', 'start', '775558'], ['timeOffset', 'end', '775558']]
        } else if(slug[0] === 'repeat') {
            categoryBreaks = [['repeatAfter', '00:05:00', '775558']]
        } else if(slug[0] === 'fixed') {
            categoryBreaks = [['timeOffset', '00:00:05', '775558'], ['timeOffset', "00:04:55", '775558'], ['timeOffset', "00:08:00", '775558']]
        } else if(slug[0] === 'percent') {
            categoryBreaks = [['timeOffset', '10%', '775558'], ['timeOffset', "50%", '775558'], ['timeOffset', "90%", '775558']]
        }
        categoryBreaks.forEach(ab => ab[2]=vpx+ab[2])
        sendVMAP(req, res, categoryBreaks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
