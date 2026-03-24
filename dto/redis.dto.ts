const Action = {
    CREATE :"CREATE",
    DELETE :"DELETE",
    UPDATE :"UPDATE"
} as const;

const Resource = {
    USER: "USER",
    TOKEN: "TOKEN",
    SKILL: "SKILL",
    TAG: "TAG",
    REEL: "REEL",
    LIKE: "LIKE",
    VIEW: "VIEW",
    INTERACTION: "INTERACTION",
    REPORT: "REPORT",
    CHALLENGE: "CHALLENGE"
}

export { Action, Resource }