import Course from  "./course"
import Question from "./question"
import Result from "./result"


interface Quiz {
    _id: any,
    quizId:string,
    slug: string,
    courseId: Course,
    questions: [Question],
    totalTime: string ,
    totalQuestion: number,
    totalMarks: string,
    results: [Result]
}

//export part
export default Quiz
