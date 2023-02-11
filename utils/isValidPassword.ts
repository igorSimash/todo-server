const isValidPassword = (password: string) => {
    return password.length >= 8
}

module.exports = isValidPassword;