// Como o TypeScript tem a sintaxe semelhante ao JS é mais facil de utilizar, e tambem trabalhar com tipagem dinamica

interface User {
    birthYear: number
}

// Dentro das funcoes podemos tipar os parametros (Vincular aos tipos ja definidos)
export function calculateAge(user: User) {
    const currentYear = new Date().getFullYear()
    return currentYear - user.birthYear
}

calculateAge({ 
    birthYear: 1994 
})
