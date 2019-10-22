import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink, Operation } from 'apollo-link';
import { StorageKeys } from './storag-keys';

@NgModule({
    imports:[
        HttpClientModule,
        ApolloModule,
        HttpLinkModule
    ]
})
export class ApolloConfigModule {

    constructor(
        private apollo: Apollo,
        private httpLink: HttpLink
    ) {
        const uri = 'https://api.graph.cool/simple/v1/cjzsyt38x0xuy0103ba7jy6qe';
        const http = httpLink.create({uri});

        const authMiddleware: ApolloLink = new ApolloLink((operation: Operation, forwad) =>{
            operation.setContext({
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${this.getAuthToken()}`
                })
            })
            return forwad(operation);
        });

        const linkError = onError(({response, graphQLErrors, networkError }) => {
            if (graphQLErrors){
                graphQLErrors.map(({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
                );
            }
            if (networkError){
                console.log(`[Network error]: ${networkError}`);
            } 
        });

        apollo.create({
            link: ApolloLink.from([
                linkError,
                authMiddleware.concat(http),
            ]),
            cache: new InMemoryCache()
        })
    }

    private getAuthToken():string{
        return window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
    }
}