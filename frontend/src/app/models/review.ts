export class Review {
    constructor(
        public _id: string,
        public author: string,
        public title: string,
        public edition: Number,
        public key_words: any[],
        public description: string,
        public topics: any[],
        public copies: Number,
        public available: Number,
        public frequency: string,
        public examples: Number,
        public count: Number
    ){}
}