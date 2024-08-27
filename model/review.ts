
export class Review {
    public nickname: string;
    public summary: string;
    public content: string;
    public rating: Review.Rating;

    public static builder() {
        return new Review.Builder();
    }

    static Builder = class {
        private builded: Review;
        constructor() {
            this.builded = new Review;
        }
        nickname(text: string) {
            this.builded.nickname = text;
            return this;
        }
        summary(text: string) {
            this.builded.summary = text;
            return this;
        }
        content(text: string) {
            this.builded.content = text;
            return this;
        }
        rating(rating: Review.Rating) {
            this.builded.rating = rating;
            return this;
        }
        build() {
            return this.builded;
        }
    }
}


export namespace Review {
    export enum Rating {
        ONE_STAR = 1,
        TWO_STARS = 2,
        THREE_STARS = 3,
        FOUR_STARS = 4,
        FIVE_STARS = 5,
    }
}