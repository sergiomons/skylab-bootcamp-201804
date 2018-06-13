'use strict'

require('dotenv').config()

const { mongoose, models: { User, Order, Product, Category, Subcategory } } = require('data')
const logic = require('.')
const { expect } = require('chai')

const { env: { DB_URL } } = process

describe('logic nutrifit', () => {
    let userDataRegister, userData, otherUserData, dummyUserId, indexes, polloVerdurasData, terneraData, polloArrozData, sopaVerdurasData, sopaMariscoData, pescadoPlanchaData, pack_CategoryData

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        userDataRegister = { username: 'sergi', email: 'ser@email.com', password: '123', repeatPassword: '123' }
        userData = { name: 'Sergio', surname: 'M', username: 'sergi', email: 'ser@email.com', password: '123', address: 'Calle V', phone: 123456789, points: 4, orders: [] }
        otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', password: '456' }
        dummyUserId = '123456781234567812345678'

        indexes = []
        // products data
        polloVerdurasData = { image: 'http://images.com/1234', name: 'Pollo con verduras', description: 'Pollo con verduras desc', price: 4.25 }
        terneraData = { image: 'http://images.com/1234', name: 'Ternera asada', description: 'Ternera asada desc', price: 4 }
        polloArrozData = { image: 'http://images.com/1234', name: 'Pollo con arroz', description: 'Pollo con arroz desc', price: 4.50 }
        sopaVerdurasData = { image: 'http://images.com/1234', name: 'Sopa de verduras', description: 'Sopa de verduras desc', price: 3 }
        sopaMariscoData = { image: 'http://images.com/1234', name: 'Sopa de marisco', description: 'Sopa de marisco desc', price: 3.25 }
        pescadoPlanchaData = { image: 'http://images.com/1234', name: 'Pescado a la plancha', description: 'Pescado a la plancha desc', price: 4 }
        // categories
        pack_CategoryData = { name: 'Pack' }

        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove(), Product.deleteMany()])
    })

    describe('register user', () => {
        it('should succeed on correct data', () => {
            const { username, email, password, repeatPassword } = userDataRegister

            return logic.registerUser('sergi', 'ser@email.com', '123', '123')
                .then(res => expect(res).to.be.true)
        })

        it('should fail no match password', () =>{
            const { username, email, password, repeatPassword } = userDataRegister

            return logic.registerUser(username, email, password, '124')
                .catch(({ message }) => expect(message).to.equal('the fields password not match'))
        })

        it('should fail on existing username', () => {
            User.create(userDataRegister)
                .then(() => {
                    return logic.registerUser(username, 'other@email.com', '123', '123')
                        .catch(({ message }) => expect(message).to.equal(`user with username ${username} already exists`))
                })
        })

        it('should fail on existing email', () => {
            User.create(userDataRegister)
                .then(() => {
                    return logic.registerUser('otherUsername', email, '123', '123')
                        .catch(({ message }) => expect(message).to.equal(`user with email ${email} already exists`))
                })
        })

        it('should fail on no user username', () =>
            logic.registerUser()
                .catch(({ message }) => expect(message).to.equal('username is not a string'))
        )

        it('should fail on empty user username', () =>
            logic.registerUser('')
                .catch(({ message }) => expect(message).to.equal('username is empty or blank'))
        )

        it('should fail on blank user username', () =>
            logic.registerUser('     ')
                .catch(({ message }) => expect(message).to.equal('username is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.registerUser(userDataRegister.username)
                .catch(({ message }) => expect(message).to.equal('email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.registerUser(userDataRegister.username, '')
                .catch(({ message }) => expect(message).to.equal('email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.registerUser(userDataRegister.username, '     ')
                .catch(({ message }) => expect(message).to.equal('email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email)
                .catch(({ message }) => expect(message).to.equal('password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email, '')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email, '     ')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )

        it('should fail on no user repeatPassword', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email, userDataRegister.password)
                .catch(({ message }) => expect(message).to.equal('repeatPassword is not a string'))
        )

        it('should fail on empty user repeatPassword', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email, userDataRegister.password, '')
                .catch(({ message }) => expect(message).to.equal('repeatPassword is empty or blank'))
        )

        it('should fail on blank user repeatPassword', () =>
            logic.registerUser(userDataRegister.username, userDataRegister.email, userDataRegister.password, '     ')
                .catch(({ message }) => expect(message).to.equal('repeatPassword is empty or blank'))
        )
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userDataRegister)
                .then(() =>
                    logic.authenticateUser('ser@email.com', '123')
                        .then(id => expect(id).to.exist)
                )
        )

        it('should fail on wrong email', () =>
            logic.authenticateUser('fff@as.com', userDataRegister.password)
                .catch(({ message }) => expect(message).to.equal('Email o password incorrectos'))
        )

        it('should fail on wrong password', () =>
            logic.authenticateUser(userDataRegister.email, '124')
                .catch(({ message }) => expect(message).to.equal('Email o password incorrectos'))
        )

        it('should fail on no user email', () =>
            logic.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.authenticateUser(userDataRegister.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.authenticateUser(userDataRegister.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.authenticateUser(userDataRegister.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('retrieve user', () => {

        // const { name, surname, username, email, password, address, telephone, points, orders } = userData

        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
                })
                .then(user => {
                    expect(user).to.exist

                    const { _id, name, surname, username, email, password, address, phone, points, orders } = user

                    expect(name).to.equal('Sergio')
                    expect(surname).to.equal('M')
                    expect(username).to.equal('sergi')
                    expect(email).to.equal('ser@email.com')
                    expect(address).to.equal('Calle V')
                    expect(phone).to.equal('123456789')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                    expect(points).to.be.undefined
                    expect(orders).to.be.undefined
                })
        )

        it('should fail on no user id', () =>
            logic.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    // describe('udpate user', () => {
    //     it('should succeed on correct data', () =>
    //         User.create(userData)
    //             .then(({ id }) => {
    //                 return logic.updateUser(id, 'Jack', 'Wayne', 'jd@mail.com', '123', 'jw@mail.com', '456')
    //                     .then(res => {
    //                         expect(res).to.be.true

    //                         return User.findById(id)
    //                     })
    //                     .then(user => {
    //                         expect(user).to.exist

    //                         const { name, surname, email, password } = user

    //                         expect(user.id).to.equal(id)
    //                         expect(name).to.equal('Jack')
    //                         expect(surname).to.equal('Wayne')
    //                         expect(email).to.equal('jw@mail.com')
    //                         expect(password).to.equal('456')
    //                     })
    //             })
    //     )

    //     it('should fail on changing email to an already existing user\'s email', () =>
    //         Promise.all([
    //             User.create(userData),
    //             User.create(otherUserData)
    //         ])
    //             .then(([{ id: id1 }, { id: id2 }]) => {
    //                 const { name, surname, email, password } = userData

    //                 return logic.updateUser(id1, name, surname, email, password, otherUserData.email)
    //             })
    //             .catch(({ message }) => expect(message).to.equal(`user with email ${otherUserData.email} already exists`))
    //     )

    //     it('should fail on no user id', () =>
    //         logic.updateUser()
    //             .catch(({ message }) => expect(message).to.equal('user id is not a string'))
    //     )

    //     it('should fail on empty user id', () =>
    //         logic.updateUser('')
    //             .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
    //     )

    //     it('should fail on blank user id', () =>
    //         logic.updateUser('     ')
    //             .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
    //     )

    //     it('should fail on no user name', () =>
    //         logic.updateUser(dummyUserId)
    //             .catch(({ message }) => expect(message).to.equal('user name is not a string'))
    //     )

    //     it('should fail on empty user name', () =>
    //         logic.updateUser(dummyUserId, '')
    //             .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
    //     )

    //     it('should fail on blank user name', () =>
    //         logic.updateUser(dummyUserId, '     ')
    //             .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
    //     )

    //     it('should fail on no user surname', () =>
    //         logic.updateUser(dummyUserId, userData.name)
    //             .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
    //     )

    //     it('should fail on empty user surname', () =>
    //         logic.updateUser(dummyUserId, userData.name, '')
    //             .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
    //     )

    //     it('should fail on blank user surname', () =>
    //         logic.updateUser(dummyUserId, userData.name, '     ')
    //             .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
    //     )

    //     it('should fail on no user email', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname)
    //             .catch(({ message }) => expect(message).to.equal('user email is not a string'))
    //     )

    //     it('should fail on empty user email', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname, '')
    //             .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
    //     )

    //     it('should fail on blank user email', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname, '     ')
    //             .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
    //     )

    //     it('should fail on no user password', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email)
    //             .catch(({ message }) => expect(message).to.equal('user password is not a string'))
    //     )

    //     it('should fail on empty user password', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '')
    //             .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
    //     )

    //     it('should fail on blank user password', () =>
    //         logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '     ')
    //             .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
    //     )
    // })

    describe('list all products', () => {
        it('should succeed on correct data', () => {
            return new Category(pack_CategoryData).save()
                .then(category => {
                    polloVerdurasData.category = category._id
                    terneraData.category = category._id
                    polloArrozData.category = category._id
                    sopaVerdurasData.category = category._id
                    sopaMariscoData.category = category._id
                    pescadoPlanchaData.category = category._id

                    return Promise.all([
                        new Product(polloVerdurasData).save(),
                        new Product(terneraData).save(),
                        new Product(polloArrozData).save(),
                        new Product(sopaVerdurasData).save(),
                        new Product(sopaMariscoData).save(),
                        new Product(pescadoPlanchaData).save()
                    ])
                        .then(([polloVerduras, ternera, polloArroz, sopaVerduras, sopaMarisco, pescadoPlancha, packCategory]) => {
                            return polloVerduras.save()
                                .then(() => {
                                    return logic.listProducts()
                                        .then(products => {

                                            expect(products.length).to.equal(6)

                                            const product = products.find(product => product.id == polloVerduras._doc._id.toString())
                                            expect(product.id.toString()).to.equal(polloVerduras._doc._id.toString())
                                            expect(product.id.toString()).not.to.equal(ternera._doc._id.toString())
                                            expect(product.name).to.equal(polloVerduras.name)
                                            expect(product.description).to.equal(polloVerduras.description)
                                            expect(product.price).to.equal(polloVerduras.price)
                                            expect(product.categoryId).to.equal(category._id.toString())
                                        })
                                })
                        })
                })
        })
    })

    describe('list root categories', () => {
        it('should succeed on correct data', () => {
            return new Category(pack_CategoryData).save()
                .then(category => {
                    polloVerdurasData.category = category._id
                    terneraData.category = category._id
                    polloArrozData.category = category._id

                    return Promise.all([
                        new Product(polloVerdurasData).save(),
                        new Product(terneraData).save(),
                        new Product(polloArrozData).save(),
                    ])
                        .then(([polloVerduras, ternera, polloArroz]) => {
                            return polloVerduras.save()
                                .then(() => {
                                    return logic.listProducts()
                                        .then(products => {

                                            expect(products.length).to.equal(6)

                                            const product = products.find(product => product.id == polloVerduras._doc._id.toString())
                                            expect(product.id.toString()).to.equal(polloVerduras._doc._id.toString())
                                            expect(product.id.toString()).not.to.equal(ternera._doc._id.toString())
                                            expect(product.name).to.equal(polloVerduras.name)
                                            expect(product.description).to.equal(polloVerduras.description)
                                            expect(product.price).to.equal(polloVerduras.price)
                                            expect(product.categoryId).to.equal(category._id.toString())
                                        })
                                })
                        })
                })
        })
    })


    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})

// [polloVerduras, ternera, polloArroz, sopaVerduras, sopaMarisco, pescadoPlancha]