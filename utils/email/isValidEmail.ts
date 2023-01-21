const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
}

module.exports = isValidEmail