export class User {
    constructor(
        public _id: string,
        public id: Number,
        public name: string,
        public lastname: string,
        public username: string,
        public password: string,
        public email: string,
        public phone: Number,
        public role: string,
        public books: [],
        public reviews: [],
        public history_books: [],
        public history_reviews: [],
        public count: Number
    ){}
}