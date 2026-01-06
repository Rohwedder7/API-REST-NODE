// Como o TypeScript tem a sintaxe semelhante ao JS é mais facil de utilizar, e tambem trabalhar com tipagem dinamica
// Dentro das funcoes podemos tipar os parametros (Vincular aos tipos ja definidos)
function calculateAge(user) {
    var currentYear = new Date().getFullYear();
    return currentYear - user.birthYear;
}
calculateAge({
    birthYear: 1994
});
