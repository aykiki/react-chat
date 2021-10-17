export const getTimeStringFromDateObject = (date) => {
    return [
        (date.getHours() > 9 ? '' : '0') + date.getHours(),
        (date.getMinutes() > 9 ? '' : '0') + date.getMinutes(),
        (date.getSeconds() > 9 ? '' : '0') + date.getSeconds(),
    ].join(':');
};