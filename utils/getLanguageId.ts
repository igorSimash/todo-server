const getLanguageId = (language: string): number => {
    return language === 'en' ?
        1
        : language === 'ua' ?
            2
            : language === 'pl' ?
                3
                :
                0
}

module.exports = getLanguageId