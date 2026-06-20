const rssResponse = await fetch('https://globalnews.ca/edmonton/feed');
const text = await rssResponse.text();

const titles = [...text.matchAll(/<title>(.*?)<\/title>/g)]
                .flatMap(m => m[1].match(/[A-Za-z]+/g) || [] )
                .filter((el) => el.length === 5);
const deduplicatedTitles = [...new Set(titles)];
const randomWord = deduplicatedTitles[Math.floor(Math.random() * deduplicatedTitles.length)].toUpperCase();

const fileContent = JSON.stringify({randomWord})
const blob = new Blob([fileContent], { type: 'application/json' });

const formData = new FormData();
formData.append('data/wordle/word.json', blob, 'data/wordle/word.json');

// post to neocities
const res = await fetch('https://neocities.org/api/upload', {
    method: 'POST', 
    headers: { Authorization: `Bearer ${process.env.NEOCITIES_API_KEY}` }, 
    body: formData
})

const result = await res.json();
console.log("result", result);
