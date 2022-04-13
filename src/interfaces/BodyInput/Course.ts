interface CreateNewCourse {
    courseName: string,
    duration: string
}

interface Options {
    no: string,
    option: string,
}

interface Questions {
    question: string,
    mark: number,
    correctOption: string
    options: [Options]
}

interface CreateMCQModal {
    courseId:string,
    totalTime: string ,
    totalQuestion: number,
    questions: [Questions]
}

export {
    CreateNewCourse,
    CreateMCQModal
}