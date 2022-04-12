interface UpdateReturn {
    acknowledged: boolean,
    modifiedCount: number,
    upsertedId: any | null,
    upsertedCount: number,
    matchedCount: number
}

export {
    UpdateReturn
}