module.exports = class Validator {
    constructor(rules) {
        this.rules = rules;
    }

    validate(obj) {
        const errors = [];

        for (const field of Object.keys(this.rules)) {

            const rules = this.rules[field];

            if (typeof obj !== 'object') {
                errors.push({field, error: `it must be an object, but it is a ${typeof obj}`});
                console.log(errors)
                return errors;
            }

            let a = 0;
            for (const objField of Object.keys(obj)) {
                for (const field of Object.keys(this.rules)) {
                    if (field === objField) {
                        a += 1
                    }
                }
            }

            if (a != Object.keys(obj).length) {
                errors.push({field, error: `one of the field names is wrong`});
                console.log(errors)
                return errors;
            }

            const value = obj[field];
            const type = typeof value;

            if (type !== rules.type) {
                errors.push({field, error: `expect ${rules.type}, got ${type}`});
                console.log(errors)
                return errors;
            }

            switch (type) {
                case 'string':
                    if (value.length < rules.min) {
                        errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
                    }
                    if (value.length > rules.max) {
                        errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
                    }
                    break;
                case 'number':
                    if (value < rules.min) {
                        errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
                    }
                    if (value > rules.max) {
                        errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
                    }
                    break;
            }
        }

        return errors;
    }
};
