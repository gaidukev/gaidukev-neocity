import path from "path";

// get the books I've read / reading, including reading progress and notes I've made
const query = `
    query MyBooks {
        me {
            user_books(
                where: { status_id: { _in: [2, 3] } }
                order_by: [{ updated_at: desc }]
            ) {
                status_id
                rating
                user_book_reads(order_by: { started_at: desc }, limit: 1) {
                    progress_pages
                    finished_at
                }  
                reading_journals {
                    entry
                    created_at
                }
                book {
                    id
                    title
                    pages
                    slug
                    cached_tags
                    image { 
                        url
                        height 
                        width 
                    }
                    contributions( where: { contribution: { _is_null: true } } ) 
                    { 
                        author { name } 
                        contribution 
                    }
                    
                    allEditions: editions(
                        where: { image: { url: { _is_null: false } } }
                        order_by: [{ image: { height: desc } }]
                        limit: 10
                    ) {
                        image { url height width }
                        language { language }
                    }
                    englishEdition: editions(
                        where: { 
                            image: { url: { _is_null: false } }
                            language: { language: { _eq: "English" } }
                        }
                        order_by: [{ image: { height: desc } }]
                        limit: 1
                    ) {
                        image { url height width }
                        language { language }
                    }

                }
            }

            lists {
                name 
                list_books {
                    book { id }
                }
            }
        }
    }
`
const endpoint = "https://api.hardcover.app/v1/graphql";

async function fetchImage(url) {
    const filename = decodeURIComponent(path.basename(new URL(url).pathname));
    const neocitiesPath = `misc-assets/book-covers/${filename}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const buffer = await res.arrayBuffer();

    return { neocitiesPath, blob: new Blob([buffer]) };
}

async function main() {
    const token = process.env.HARDCOVER_API_KEY;
    const neocitiesKey = process.env.NEOCITIES_API_KEY;
    if (!token) {
        console.error("Token not found.")
        process.exit(1);
    }
    if (!neocitiesKey) {
        console.error("Neocities API key not found.")
        process.exit(1);
    }

    // get the items.
    const response = await fetch(endpoint, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`, 
            "User-Agent": "sync_books/1.0"
        }, 
        body: JSON.stringify({query: query})
    })

    // check if server returned an error
    if (!response.ok) {
        console.error(`API call returned ${response.status}`);
        process.exit(1);
    }

    // check if data is parsing well
    const json = await response.json();
    if (json.errors) {
        console.error("Errors parsing GraphQL: ", JSON.stringify(json.errors, null, 2));
        process.exit(1);
    } 

    // get the object containing the results (may be nested in an array)
    const me = Array.isArray(json.data?.me) ? json.data.me[0] : json.data?.me;
    // get all books in my list
    const myBooks = me?.user_books ?? [];
    // get the On My Mind list -- goes in my "favorites"
    const onMyMind = me?.lists?.find((el) => el.name === 'On My Mind')?.list_books;

    const formData = new FormData();

    const outList = await Promise.all(myBooks.map(async (entry) => {
        // calculate the progress -- the API returns page counts only
        const bookProgress = entry.status_id === 2 ? (Math.floor((entry.user_book_reads?.[0]?.progress_pages / entry.book.pages ) * 100 )) : 100;
        const largestImage = entry?.book?.allEditions?.[0]?.image;
        const largestEnglishImage = entry?.book?.englishEdition?.[0]?.image;
        const imgUrl = largestEnglishImage && largestEnglishImage?.height > 450 ? largestEnglishImage?.url : largestImage?.url ?? '';

        const { neocitiesPath, blob } = await fetchImage(imgUrl);
        formData.append(neocitiesPath, blob, neocitiesPath);

        return {
            title: entry.book.title,
            // if more than one author, comma-separate them
            author: entry.book.contributions.map((contribution) => contribution.author.name).join(", "),
            finished: entry.status_id !== 2,
            progress: bookProgress,
            rating: entry.rating,
            cover_url: neocitiesPath,
            recent_fav: onMyMind?.find((el) => el.book.id === entry.book.id) ? true : false,
            // get the reading journal entry with tags
            // will start with Keywords:
            // example: Keywords: A; B; C
            tags: (entry.reading_journals
                    ?.find((el) => el.entry && el.entry.toLowerCase().includes("keywords"))
                    ?.entry
                    ?.split("Keywords: ")[1]
                    ?.split("; ") ?? []
                ).map((tag) => tag.replace(';', '').trim()),
            hardcover_mood: entry.book.cached_tags?.Mood?.map(
                    (el) => el.tag.charAt(0).toUpperCase() + el.tag.slice(1) ) ?? []
        }
    }));

    if (outList && outList.length > 0) {
        const booksBlob = new Blob([JSON.stringify(outList, null, 2)], { type: 'application/json' });
        formData.append('books.json', booksBlob, 'books.json');

        const res = await fetch('https://neocities.org/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${neocitiesKey}` },
            body: formData
        });
        const result = await res.json();
        console.log("Upload result:", result);
    }
}

main();