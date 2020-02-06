const _ = require('lodash');

const ROLES = {
    USER: {
        CREATE: {
            TASK: true,
            USER: false,
        },
        READ: {
            TASK: {
                OWNER: true,
                NOT_OWNER: false,
            },
            USER: {
                SELF: true,
                OTHER: false
            },
        },
        UPDATE: {
            TASK: {
                OWNER: {
                    value: true,
                    isDone: true,
                    deadline: true,
                    userId: false,
                    createdAt: false,
                    updatedAt: false,
                },
                NOT_OWNER: false,
            },
            USER: {
                USER: {
                    SELF: true,//authorize check?
                    OTHER: false,//
                },
                ADMIN: false,
            },
        },
        DELETE: {
            TASK: {
                OWNER: true,
                NOT_OWNER: false,
            },
            USER: false,
        },
    },
    ADMIN: {
        CREATE: {
            TASK: true,
            USER: {
                USER: true,
                ADMIN: false
            },
        },
        READ: true,
        UPDATE: {
            TASK: {
                OWNER: true,
                NOT_OWNER: false,
            },
            USER: {
                USER: {
                    firstName: false,
                    lastName: false,
                    login: true,
                    password: false,
                    email: false,
                },
                ADMIN: false,
            }
        },
        DELETE: {
            TASK: {
                OWNER: true,
                NOT_OWNER: false,
            },
            USER: {

                USER: true,
                ADMIN: false,

            }
        }
    }
};

/*function createCheckPermission(roles) {
    return function checkPermission(query) {
        let roles = roles;
        if (roles[query[0]] === true) {
            return true
        } else if (roles[query[0]] === undefined) {
            return false;
        } else {
            roles = roles[query[0]];
            query.shift();
            return checkPermission(query)
        }
    }
}*/

//const checkPermission = createCheckPermission(ROLES);

function checkPermission(query, roles = ROLES) {
    if (Array.isArray(query[0])) {
        return query[0].every(elem => {

            checkPermission(_.concat(elem, query.slice(1)), roles)
        })
    } else {
        if (roles[query[0]] === true) {
            return true
        } else if (roles[query[0]] === undefined) {
            debugger
            return false;
        } else {
            roles = roles[query[0]];
            query.shift();
            return checkPermission(query, roles)
        }
    }
}

//console.log(checkPermission(query, ROLES));

const query = ['USER', 'CREATE', 'TASK'];// true
const query2 = ['ADMIN', 'DELETE', 'USER', ['USER']];// false
const query3 = ['USER', 'READ', 'USER', 'SELF'];// true
const query4 = ['ADMIN', 'UPDATE', 'TASK', 'NOT_OWNER'];// false


console.log(checkPermission(query));
console.log(checkPermission(query2));
console.log(checkPermission(query3));
console.log(checkPermission(query4));