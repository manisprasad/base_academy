export type Stream = "Science" | "Commerce" | "Arts";

export const getSubjectsForClass = (classValue: string, stream?: Stream): string[] => {
    const lowerClassSubjects = [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Geography",
        "History",
        "Civics",
        "Computer",
        "Sanskrit",
        "General Knowledge",
        "Environmental Studies"
    ];

    const seniorSubjects: Record<Stream, string[]> = {
        Science: [
            "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science",
            "English", "Hindi", "Physical Education", "Informatics Practices"
        ],
        Commerce: [
            "Accountancy", "Business Studies", "Economics", "Mathematics", "English",
            "Hindi", "Entrepreneurship", "Informatics Practices", "Physical Education"
        ],
        Arts: [
            "History", "Geography", "Political Science", "Sociology", "Psychology",
            "English", "Hindi", "Economics", "Fine Arts", "Physical Education", "Home Science"
        ]
    };

    if (["11", "12"].includes(classValue) && stream) {
        return seniorSubjects[stream] || [];
    }

    return lowerClassSubjects;
};
