const moment = require('moment');
module.exports = {
    dateformate: function (date) {
        // console.log("This is date helper");
        // console.log(date);
        const value = moment(date).format("llll")
        // console.log("Moment helper call", value);
        return value;
    },
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    userCompare: function (lvalue, operator,rvalue ,options) {
        try {
            // console.log(lvalue, rvalue);
            // console.log(options);
            if (arguments.length < 3){
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }
            var operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'typeof': function (l, r) { return typeof l == r; }
            }

            if (!operators[operator]){
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }

            var result = operators[operator](lvalue, rvalue);
            // console.log(result);
            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }

        } catch (error) {
            console.log("helper error");
            console.log(error);
        }
    }
}