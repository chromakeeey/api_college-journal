const groups = [
    {
        id: 0,
        specialty: 5,
        course: 4,
        subgroup_id: 1
    },
    {
        id: 1,
        specialty: 5,
        course: 3,
        subgroup_id: 1
    },
    {
        id: 2,
        specialty: 5,
        course: 3,
        subgroup_id: 2
    },
]

const subjects = [
    { id: 0, name: '.NET' },
    { id: 1, name: 'Веб-технології' },
    { id: 2, name: 'Мобільні пристрої' },
    { id: 3, name: 'С++' },
    { id: 4, name: 'Основи програмування' },
    { id: 5, name: 'Алгоритми' },
    { id: 6, name: 'Чисельні методи' },
]

const group_subjects = [
    { id: 0, group_id: 0, subject_id: 0 },
    { id: 1, group_id: 0, subject_id: 1 },
    { id: 2, group_id: 0, subject_id: 2 },
    { id: 3, group_id: 0, subject_id: 6 },

    { id: 4, group_id: 1, subject_id: 0 },
    { id: 5, group_id: 1, subject_id: 1 },
    { id: 6, group_id: 1, subject_id: 3 },
    { id: 7, group_id: 1, subject_id: 4 },
    { id: 8, group_id: 1, subject_id: 5 },
]

const users = [
    {id: 0, name: 'Олександр', surname: 'Паламарчук'},
    {id: 1, name: 'Василь', surname: 'Рандомний'},
    {id: 2, name: 'Андрій', surname: 'Простий'},
]

const program_education = [
    {
        id: 0,
        specialty: 5,
        course: 4,
        subject_id: 6, 

        themes: [
            {id: 0, program_education_id: 0, name: 'Середовища розробки', type: 0},
            {id: 1, program_education_id: 0, name: 'Середовища розробки', type: 1},
            {id: 2, program_education_id: 0, name: 'Середовища розробки', type: 0},
            {id: 3, program_education_id: 0, name: 'Середовища розробки', type: 0}
        ]
    },
    {
        id: 1,
        specialty: 5,
        course: 3,
        subject_id: 4,

        themes: [
            {id: 0, program_education_id: 1, name: 'Вступ до спеціальності', type: 0},
            {id: 1, program_education_id: 1, name: 'Вступ до спеціальності', type: 1},
            {id: 2, program_education_id: 1, name: 'Вступ до спеціальності', type: 0},
            {id: 3, program_education_id: 1, name: 'Вступ до спеціальності', type: 0}
        ]
    }
]

const grade = [
    {},
    {}
]

module.exports = {
    groups,
    subjects,
    group_subjects,
    users,
    program_education,
    grade
}