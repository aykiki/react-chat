export const getDateStringFromDateObject = (date) => {
    return [
        (date.getDate() > 9 ? '' : '0') + date.getDate(),
        (date.getMonth() + 1 > 9 ? '' : '0') + (date.getMonth() + 1),
        date.getFullYear(),
    ].join('.');
};
