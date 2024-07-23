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

let newCompany1 = new Feedback('Ferguson', 'Great work')
newCompany1.saveCompany();
console.log(compFeedback)
let newCompany2 = new Feedback('Action', 'Great work')
newCompany2.saveCompany();
console.log(compFeedback)