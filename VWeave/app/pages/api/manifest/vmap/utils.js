export const vmap = (adBreaks, query) => {
    const adBreakBlock = (ab, idx) => `<vmap:AdBreak breakId="${idx+1}" breakType="linear" ${ab[0]}="${ab[1]}">
        <vmap:AdSource allowMultipleAds="true" followRedirects="true" id="1">
            <vmap:AdTagURI templateType="vast3"><![CDATA[ ${ab[2]+(query ? `?${query}`: '')} ]]></vmap:AdTagURI>
        </vmap:AdSource>
    </vmap:AdBreak>`
    return `<vmap:VMAP xmlns:vmap="http://www.iab.net/vmap-1.0" version="1.0">
                ${adBreaks.map(adBreakBlock).join('')}
            </vmap:VMAP>`
};

export const sendVMAP = (req, res, categoryBreaks) => {
    res.setHeader('Content-Type', 'text/xml');
    res.send(vmap(categoryBreaks, req.url.split('?')[1] || ''))
}