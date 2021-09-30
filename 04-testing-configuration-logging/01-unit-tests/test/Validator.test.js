const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
    describe('Validator', () => {
        it('валидатор проверяет соответствие типов', () => {
            const validator = new Validator({
                name: {
                    type: 'string',
                    min: 5,
                    max: 10
                },
                age: {
                    type: 'number',
                    min: 18,
                    max: 27
                }
            });

            const errors = validator.validate("NCG 5728");

            expect(errors).to.have.length(1);

            expect(errors[0]).to.have.property('error').and.to.be.equal('it must be an object, but it is a string');
        });

        it('валидатор проверяет соответствие названий полей', () => {
            const validator = new Validator({
                name: {
                    type: 'string',
                    min: 5,
                    max: 10
                },
                age: {
                    type: 'number',
                    min: 18,
                    max: 27
                }
            });

            const errors = validator.validate({names: 'Lalala', age: 58});

            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('error').and.to.be.equal('one of the field names is wrong');
        });

        it('валидатор проверяет совпадение типов значений', () => {
            const validator = new Validator({
                name: {
                    type: 'string',
                    min: 5,
                    max: 10
                },
                age: {
                    type: 'number',
                    min: 18,
                    max: 27
                }
            });

            const errors = validator.validate({name: 'Lalala', age: 'fourteen' });

            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
        });

        it('валидатор проверяет строковые поля', () => {
            const validator = new Validator({
                name: {
                    type: 'string',
                    min: 5,
                    max: 10
                },
                age: {
                    type: 'number',
                    min: 18,
                    max: 27
                }
            });

            const errors = validator.validate({name: 'Lala', age: 26});
            console.log(errors)
            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('field').and.to.be.equal('name');
            expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
        });

        it('валидатор проверяет числовые поля', () => {
            const validator = new Validator({
                name: {
                    type: 'string',
                    min: 5,
                    max: 10
                },
                age: {
                    type: 'number',
                    min: 18,
                    max: 27
                }
            });

            const errors = validator.validate({name: 'Lalala', age: 46});

            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('field').and.to.be.equal('age');
            expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 46');
        });
    });
});
