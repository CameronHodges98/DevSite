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

const companyName = document.getElementById('companyName').value;
const feedback = document.getElementById('comments').value;

function handleSubmit() {
    const company = new Feedback(companyName, feedback);
    company.saveCompany;
    console.log(compFeedback);

}