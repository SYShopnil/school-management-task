import Quiz from "./quiz"
interface Options {
    no: String,
    option: String,
}

interface Question {
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
