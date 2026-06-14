import { getColors } from "./books-colors.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("booksPage", () => ({
    allBooks: [],
    recentFavorites: [],
    currentlyReading: [],
    favoritesIndex: 0,
    readingIndex: 0,
    cardWidth: 100,//360,
    visibleCount: 3,

    async init() {
      const res = await fetch("./books.json").then((r) => r.json());
      this.allBooks = res.reverse();
      this.recentFavorites = this.allBooks.filter((el) => el.recent_fav);
      this.currentlyReading = this.allBooks.filter((el) => el.progress < 100);

      for (const book of this.allBooks) {
        this.loadBookColors(book);
      }
      
      this.$nextTick(() => {
        this.respondToRender();
        // run after the DOM is updated (presumably the book cards have loaded)
        const observer = new ResizeObserver(() => {
          this.respondToRender();
        });
        observer.observe(document.body); 

      });
    },

    respondToRender() {
      this.measureCardWidth();
      this.calculateVisibleCount();

    },

    calculateVisibleCount() {
      const width = this.$el.querySelector(".scrollable-content").getBoundingClientRect().width;
      this.visibleCount = Math.floor(width / this.cardWidth);
    },

    measureCardWidth() {
      const slide = this.$el.querySelector(".scrollable-content .slide");
      if (!slide) return;
      const style = window.getComputedStyle(slide);
      this.cardWidth =
        slide.getBoundingClientRect().width +
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0);
    },

    async loadBookColors(book) {
      const canvas = this.$refs.colorCanvas;
      if (!canvas) return;

      try {
        const { darkestTriplet: d, lightestTriplet: l } = await getColors(book.cover_url, canvas);
        book.colors = {
          detailsBg: `rgba(${d[0]}, ${d[1]}, ${d[2]}, 0.8)`,
          tooltipBg: `rgba(${d[0]}, ${d[1]}, ${d[2]}, 1)`,
          accent: `rgb(${l[0]}, ${l[1]}, ${l[2]})`,
        };
      } catch (e) {
        console.error("Failed to extract cover colors:", e);
      }
    },

    ratingStars(rating) {
      if (!rating) return [];
      const stars = [];
      let remainder = rating;
      while (remainder >= 1) {
        stars.push("star");
        remainder -= 1;
      }
      if (remainder === 0.5) stars.push("star_half");
      return stars;
    },

    carouselStyle(focusIndex, thisIndex) {
      return { transform: `translateX(-${focusIndex * this.cardWidth}px)` };
    },

    scrollLeft(which) {
      const key = which === "favorites" ? "favoritesIndex" : "readingIndex";
      this[key] = Math.max(0, this[key] - 1);
    },

    scrollRight(which, books) {
      const key = which === "favorites" ? "favoritesIndex" : "readingIndex";
      this[key] = Math.min(books.length - this.visibleCount, this[key] + 1);
    },

    arrowOpacity(index, books, side) {
      if (side === "left") return index === 0 ? 0.5 : 1;
      return index >= books.length - this.visibleCount ? 0.5 : 1;
    },

    accentStyle(book) {
      return book.colors?.accent ? { color: book.colors.accent } : {};
    },

    tagStyle(book) {
      return book.colors?.accent ? { borderColor: book.colors.accent } : {};
    },

    detailsBgStyle(book) {
      return book.colors?.detailsBg ? { backgroundColor: book.colors.detailsBg } : {};
    },

    tooltipBgStyle(book) {
      return book.colors?.tooltipBg ? { backgroundColor: book.colors.tooltipBg } : {};
    },
  }));
});
