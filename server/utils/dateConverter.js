const convertDate = (obj) => {
    const date = new Date(obj.due_date);

    return {...obj._doc, due_date: date.toLocaleDateString()};
};

module.exports = convertDate;