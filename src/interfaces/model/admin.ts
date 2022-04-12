import User from  "./user"
interface AcademicInfo {
    degreeName: string,
    result: string,
    season: string,
    passingYears: string
}
interface OfficialInfo {
    salary: string
}
interface Admin {
    _id: any,
    academicInfo : [AcademicInfo],
    officalInfo:OfficialInfo,
    user: User
}
//export part
export default Admin
