import { sendVMAP } from "./utils";

export default async (req, res) => {
    try {
        const vpx = "https://tv.springserve.com/rt/"
        let categoryBreaks = [  ['timeOffset', '00:20:49.247', '53475'], ['timeOffset', "00:28:53.731", '55699'],
                                ['timeOffset', "00:37:13.430", '55700'], ['timeOffset', '00:45:23.119', '55701'],
                                ['timeOffset', "00:51:07.463", '55702'], ['timeOffset', "00:56:55.011", '55703'],
                                ['timeOffset', "01:05:58.754", '55704'], ['timeOffset', '01:15:04.499', '55705']  ]
        categoryBreaks.forEach(ab => ab[2]=vpx+ab[2])
        sendVMAP(req, res, categoryBreaks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
