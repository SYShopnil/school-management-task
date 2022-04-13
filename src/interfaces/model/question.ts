import Quiz from "./quiz"
interface Options {
    no: string,
    option: string,
}

interface Question {
    _id:string,
    questionId: string,
    slug: string,
    quiz: Quiz ,
    question: string,
    mark: number,
    correctOption: string,
    options : [Options]
}

//export part
export default Question
