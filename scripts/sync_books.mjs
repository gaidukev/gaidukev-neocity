import { writeFileSync } from "fs";

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
                    image { 
                        url
                        height 
                        width 
                    }
                    contributions { author { name } }
                }  
                edition {
                    isbn_10
                    isbn_10_valid
                    isbn_13
                    isbn_13_valid
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

async function main() {
    // the token to access the API.
    const token = process.env.HARDCOVER_API_KEY;
    if (!token) {
        console.error("Token not found.")
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
    console.log("editions: ", myBooks[0])
    // get the On My Mind list -- goes in my "favorites"
    const onMyMind = me?.lists?.find((el) => el.name === 'On My Mind')?.list_books;

    const outList = myBooks.map((entry) => {
        // calculate the progress -- the API returns page counts only
        const bookProgress = entry.status_id === 2 ? (Math.floor(entry.user_book_reads?.[0]?.progress_pages / entry.book.pages ) * 100 ) : 100;

        // create a flag for the image being invalid or too small to display
        const imageTooSmallOrInvalid = !entry?.book?.image || Math.min(entry?.book?.image?.height, entry?.book?.image?.width) < 450;
        // prepare to use isbn as fallback. ISBN13 is preferred
        const isbn = entry?.edition?.isbn_13 && entry?.edition?.isbn_13_valid ? entry.edition.isbn_13 : entry?.edtion?.isbn_10;
        const imageUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : entry?.book?.image?.url;

        return {
            title: entry.book.title,
            // if more than one author, comma-separate them
            author: entry.book.contributions.map((contribution) => contribution.author.name).join(", "), 
            finished: entry.status_id !== 2, 
            progress: bookProgress, 
            rating: entry.rating,
            cover_url: imageUrl, 
            recent_fav: onMyMind?.find((el) => el.book.id === entry.book.id) ? true : false, 
            // get the reading journal entry with tags 
            // will start with Keywords: 
            // example: Keywords: A; B; C
            tags: entry.reading_journals
                ?.find((el) => el.entry && el.entry.toLowerCase().includes("keywords"))
                ?.entry
                ?.split("Keywords: ")[1]
                .split("; ") ?? []
        }
    }) 

    if (outList && outList.length > 0) {
        // update books.json
        // indent = 2
        writeFileSync("books.json", JSON.stringify(outList, null, 2));
    }
}

main();