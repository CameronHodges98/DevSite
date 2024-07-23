let compFeedback = [];
class Feedback {
    constructor(company, feedback){
        this._company = company;
        this._feedback = feedback;
    }
    get companyFeedback() {
        return console.log(`${this._company}: ${this._feedback}`);
    }
    saveCompany() {
        compFeedback.push(`${this._company}: ${this._feedback}`);
    }
}