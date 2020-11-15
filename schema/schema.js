const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql
const axios = require('axios')

const CompanyType = new GraphQLObjectType ({
  name: 'Company',
  fields: () => ( {
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return axios.get(`http://localhost:3000/companies/${parent.id}/users`)
          .then(res=> res.data)
      }
    }
  } )
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ( {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString},
    age:{ type: GraphQLInt},
    company : {
      type: CompanyType,
      resolve(parent, args) {
        //console.log(parent, args)
        return axios.get(`http://localhost:3000/companies/${parent.companyId}`)   // matches companyId with company
        .then(res=> res.data)
      }
    }
  } )
})

const RootQuery= new GraphQLObjectType({
  name:'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type:GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(response=>response.data)
      }
    },
    company: {
      type: CompanyType,
      args: {id: {type:GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(response=>response.data)
      }
    }

  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})