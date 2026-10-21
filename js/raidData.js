// 戰術記錄資料庫 (以 Season 21 為範例，其餘賽季直接以純數據追加)
export const raidData = {
    season21: {
        title: "Season 21 Result",
        url: "https://bravefrontierglobal.com/season21",
        vod: "https://www.youtube.com/live/WHx6kYAconM",
        golems: [
            "https://static.wikia.nocookie.net/bravefrontierglobal/images/c/ca/Unit_ills_full_87402601.png",
            "https://static.wikia.nocookie.net/bravefrontierglobal/images/5/53/Unit_ills_full_87102601.png"
        ],
        rooms: [
            {
                name: "Room 1: Shivani",
                records: [
                    { level: 1, outposts: ["thermal vent", "pyrotraining zone", "ajara's eye", "endostorage facility", "—"], boss: { text: "ajara's crossing", type: "green" }, golems: ["chronowave facility", "pyrotraining zone"] },
                    { level: 2, outposts: ["—", "—", "—", "—", "—"], boss: { text: "urbanotraining zone", type: "green" }, golems: ["", ""] },
                    { level: 3, outposts: ["dehn's forge", "sandslope", "—", "—", "—"], boss: { text: "farren's leisure", type: "yellow" }, golems: ["", ""] }
                ]
            },
            {
                name: "Room 2: EaglePB2",
                records: [
                    { level: 1, outposts: ["ajara's eye", "aquatraining zone", "dehn's forge", "chronowave facility", "—"], boss: { text: "dueling grounds", type: "green" }, golems: ["containment zone", "material facility"] },
                    { level: 2, outposts: ["—", "—", "—", "—", "—"], boss: { text: "kennely's greeting", type: "green" }, golems: ["", "pyrotraining zone"] },
                    { level: 3, outposts: ["thermal vent", "colony wreckage", "chronowave facility", "jeu'vrr's shrine", "—"], boss: { text: "material facility", type: "green" }, golems: ["", ""] },
                    { level: 4, outposts: ["ajara's eye", "pyrotraining zone", "endostorage facility", "—", "—"], boss: { text: "farren's grove", type: "green" }, golems: ["", ""] },
                    { level: 5, outposts: ["—", "—", "—", "—", "—"], boss: { text: "mountain passage", type: "green" }, golems: ["", ""] }
                ]
            },
            {
                name: "Room 3: Morgania",
                records: [
                    { level: 1, outposts: ["chronowave facility", "dehn's wrath", "aquatraining zone", "thermal vent", "ajara's eye"], boss: { text: "kennely's greeting", type: "green" }, golems: ["Dehn's forge", "pyrotraining zone"] },
                    { level: 2, outposts: ["—", "—", "—", "—", "—"], boss: { text: "ferren's grove", type: "green" }, golems: ["", ""] },
                    { level: 3, outposts: ["???", "???", "???", "???", "???"], boss: { text: "sparing grounds", type: "green" }, golems: ["", ""] },
                    { level: 4, outposts: ["—", "—", "—", "—", "—"], boss: { text: "???", type: "green" }, golems: ["", ""] },
                    { level: 5, outposts: ["pyrotraining zone", "thermal vent", "endostorage facility", "chronowave facility", "—"], boss: { text: "farren's leisure", type: "green" }, golems: ["", ""] },
                    { level: 6, outposts: ["aquatraining zone", "hydropower facility", "—", "—", "—"], boss: { text: "mountain passage", type: "green" }, golems: ["", ""] }
                ]
            }
        ]
    }
    // 依此類推，Season 22~24 放入純數據即可
};

// 斯巴達式純原生表格渲染器
export function renderSeasonTables(seasonKey, containerEl) {
    const data = raidData[seasonKey];
    if (!data || !containerEl) return;

    let html = '';
    const golemCols = data.golems.length;
    const totalCols = 1 + 5 + 1 + golemCols; // Level(1) + Outposts(5) + Boss(1) + Golems(N)

    data.rooms.forEach(room => {
        html += `
        <table class="raid-table">
            <thead>
                <tr><th colspan="${totalCols}">${room.name}</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2">Boss Level</td>
                    <td colspan="5" rowspan="2">Outpost Location</td>
                    <td rowspan="2">Boss Location</td>
                    <td colspan="${golemCols}">Golems Location</td>
                </tr>
                <tr>
                    ${data.golems.map(img => `<td><img src="\${img}" style="width: 80px; height: auto;"></td>`).join('')}
                </tr>
                ${room.records.map(r => {
                    const highlightClass = r.boss.type === 'green' ? 'highlight-green' : (r.boss.type === 'yellow' ? 'highlight-yellow' : '');
                    return `
                    <tr>
                        <td>${r.level}</td>${r.outposts.map(op => `<td>${op}</td>`).join('')}
                        <td class="\${highlightClass}">${r.boss.text}</td>${r.golems.map(g => `<td>${g || ''}</td>`).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    });

    containerEl.innerHTML = html;
}